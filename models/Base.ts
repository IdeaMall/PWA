import { BaseOutput, ListChunk } from '@ideamall/data-model';
import { HTTPClient } from 'koajax';
import { IDType, ListModel, NewData, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

export const isServer = () => typeof window === 'undefined';

const VercelHost = process.env.VERCEL_URL,
  GithubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const API_Host = isServer()
  ? VercelHost
    ? `https://${VercelHost}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const ownClient = new HTTPClient({
  baseURI: `${API_Host}/api/`,
  responseType: 'json',
});

export const githubClient = new HTTPClient({
  baseURI: 'https://api.github.com/',
  responseType: 'json',
}).use(({ request }, next) => {
  if (GithubToken)
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${GithubToken}`,
    };
  return next();
});

export abstract class TableModel<
  D extends BaseOutput,
  F extends NewData<D> = NewData<D>,
> extends ListModel<D, F> {
  async loadPage(pageIndex: number, pageSize: number, filter: F) {
    const { body } = await this.client.get<ListChunk<D>>(
      `${this.baseURI}?${buildURLData({ ...filter, pageIndex, pageSize })}`,
    );
    return { pageData: body!.list, totalCount: body!.count };
  }

  @toggle('uploading')
  async updateOne(data: Partial<NewData<D>>, id?: IDType) {
    const { body } = await (id
      ? this.client.put<D>(`${this.baseURI}/${id}`, data)
      : this.client.post<D>(this.baseURI, data));

    if (id) this.changeOne(body!, id);
    else
      this.restoreList({
        allItems: [...this.allItems, body!],
        totalCount: this.totalCount! + 1,
      });

    return (this.currentOne = body!);
  }
}
