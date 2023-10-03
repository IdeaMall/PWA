import { toggle } from 'mobx-restful';
import { FileModel } from 'mobx-restful-table';

import userStore from './User';

export class OwnFileModel extends FileModel {
  @toggle('uploading')
  async upload(file: File) {
    const form = new FormData();

    form.append('data', file);

    const { body } = await userStore.client.post<{ path: string }>(
      'file',
      form,
    );
    return super.upload(body!.path);
  }
}

export default new OwnFileModel();
