import { Guard } from '@authing/guard';
import { UserOutput } from '@ideamall/data-model';
import { HTTPClient, HTTPError, request } from 'koajax';
import { observable } from 'mobx';
import { toggle } from 'mobx-restful';

import { API_Host, TableModel } from './Base';

const { localStorage } = globalThis;

export const guard = new Guard({
  mode: 'modal',
  appId: process.env.NEXT_PUBLIC_AUTHING_APP_ID!,
});

export class UserModel extends TableModel<UserOutput> {
  baseURI = 'user';

  @observable
  session?: UserOutput =
    localStorage?.session && JSON.parse(localStorage.session);

  client = new HTTPClient({
    baseURI: process.env.NEXT_PUBLIC_DATA_HOST,
    responseType: 'json',
  }).use(({ request }, next) => {
    if (this.session?.token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.session.token}`,
      };
    return next();
  });

  saveSession(user: UserOutput) {
    localStorage.session = JSON.stringify(user);

    return (this.session = user);
  }

  @toggle('uploading')
  async signInAuthing(token: string) {
    const { body } = await this.client.post<UserOutput>(
      `${this.baseURI}/session/authing`,
      {},
      { Authorization: `Bearer ${token}` },
    );
    return this.saveSession(body!);
  }

  @toggle('uploading')
  async signOut() {
    await guard.logout();

    this.session = undefined;

    localStorage.clear();
  }

  @toggle('uploading')
  async upload(file: File) {
    const form = new FormData();

    form.append('data', file);

    const response = await request<{ path: string }>({
      method: 'POST',
      path: `${API_Host}/api/file`,
      headers: {
        Authorization: `Bearer ${this.session?.token}`,
      },
      body: form,
      responseType: 'json',
    }).response;

    const { status, statusText, body } = response;

    if (status > 299) throw new HTTPError(statusText, response);

    return body!.path;
  }
}

export default new UserModel();
