import { Role, UserOutput } from '@ideamall/data-model';
import { JwtPayload, verify } from 'jsonwebtoken';
import { HTTPError } from 'koajax';
import { parseLanguageHeader } from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

import { i18n } from '../../models/Translation';

export type NextAPI = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>;

export function safeAPI(handler: NextAPI): NextAPI {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        console.error(error);

        res.status(400);
        return res.send({ message: (error as Error).message });
      }
      let { message, status, body } = error;

      res.status(status);
      res.statusMessage = message;

      if (body instanceof ArrayBuffer)
        try {
          body = new TextDecoder().decode(new Uint8Array(body));
          console.error(body);

          body = JSON.parse(body);
          console.error(body);
        } catch {}

      res.send(body);
    }
  };
}

export function withErrorLog<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(origin: F) {
  return (async context => {
    try {
      return await origin(context);
    } catch (error) {
      console.error(error);

      const { status } = error as HTTPError;

      if (status === 404) return { notFound: true, props: {} };

      throw error;
    }
  }) as F;
}

interface RouteProps<T extends ParsedUrlQuery> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export function withRoute<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(
  origin?: F,
): GetServerSideProps<RouteProps<I> & InferGetServerSidePropsType<F>, I> {
  return async context => {
    const options =
        (await origin?.(context)) || ({} as GetServerSidePropsResult<{}>),
      { resolvedUrl, params, query, locales } = context;

    return {
      ...options,
      props: {
        ...('props' in options ? options.props : {}),
        route: JSON.parse(
          JSON.stringify({ resolvedUrl, params, query, locales }),
        ),
      },
    } as GetServerSidePropsResult<
      RouteProps<I> & InferGetServerSidePropsType<F>
    >;
  };
}

export function withTranslation<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(
  origin?: F,
): GetServerSideProps<RouteProps<I> & InferGetServerSidePropsType<F>, I> {
  return async context => {
    const { language = '' } = context.req.cookies,
      languages = parseLanguageHeader(
        context.req.headers['accept-language'] || '',
      );
    await i18n.loadLanguages([language, ...languages].filter(Boolean));

    return ((await origin?.(context)) || {
      props: {},
    }) as GetServerSidePropsResult<
      RouteProps<I> & InferGetServerSidePropsType<F>
    >;
  };
}

const AUTHING_APP_SECRET = process.env.AUTHING_APP_SECRET!;

export function parseJWT<T>({ headers: { authorization } }: NextApiRequest) {
  if (!authorization)
    throw new HTTPError('Authorization header is missing', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
    });
  const [type, token] = authorization.split(/\s+/);

  return verify(token, AUTHING_APP_SECRET) as JwtPayload & T;
}

export function verifyJWT(
  request: NextApiRequest,
  requiredRoles: Role[],
  { status, statusText }: Pick<Response, 'status' | 'statusText'>,
) {
  const user = parseJWT<UserOutput>(request);

  if (!requiredRoles.some(role => user.roles?.includes(role)))
    throw new HTTPError('Forbidden', { status, statusText, headers: {} });

  return user;
}
