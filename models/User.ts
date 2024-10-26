import {
  Captcha,
  SignInData,
  SMSCodeInput,
  User,
} from '@ideamall/data-service';
import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { persist, restore, toggle } from 'mobx-restful';

import { API_Host, isServer, TableModel } from './Base';

export class UserModel extends TableModel<User> {
  baseURI = 'user';
  restore = !isServer() && restore(this, 'User');

  @persist()
  @observable
  accessor session: User | undefined;

  @observable
  accessor captcha: Captcha | undefined;

  client = new HTTPClient({
    baseURI: API_Host,
    responseType: 'json',
  }).use(async ({ request }, next) => {
    await this.restore;

    if (this.session?.token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.session.token}`,
      };
    return next();
  });

  @toggle('uploading')
  async createCaptcha() {
    const { body } = await this.client.post<Captcha>(
      `${this.baseURI}/session/captcha`,
    );
    return (this.captcha = body!);
  }

  @toggle('uploading')
  async createSMSCode(data: SMSCodeInput) {
    await this.client.post(`${this.baseURI}/session/SMS-code`, data);

    this.captcha = undefined;
  }

  @toggle('uploading')
  async signIn(data: SignInData) {
    const { body } = await this.client.post<User>(
      `${this.baseURI}/session`,
      data,
    );
    return (this.session = body!);
  }

  signOut() {
    this.session = undefined;
  }
}

export default new UserModel();
