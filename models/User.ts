import { UserOutput } from '@ideamall/data-model';
import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { toggle } from 'mobx-restful';

import { TableModel } from './Base';

const { localStorage } = globalThis;

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
}

export default new UserModel();
