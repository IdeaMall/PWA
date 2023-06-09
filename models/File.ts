import { HTTPError, request } from 'koajax';
import { toggle } from 'mobx-restful';
import { FileModel } from 'mobx-restful-table';

import userStore from './User';

export class OwnFileModel extends FileModel {
  @toggle('uploading')
  async upload(file: File) {
    const form = new FormData();

    form.append('data', file);

    const response = await request<{ path: string }>({
      method: 'POST',
      path: userStore.client.baseURI + 'file',
      headers: {
        Authorization: `Bearer ${userStore.session?.token}`,
      },
      body: form,
      responseType: 'json',
    }).response;

    const { status, statusText, body } = response;

    if (status > 299) throw new HTTPError(statusText, response);

    return super.upload(body!.path);
  }
}

export default new OwnFileModel();
