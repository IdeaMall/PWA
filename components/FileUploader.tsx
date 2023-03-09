import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FilePicker, FilePickerProps } from 'mobx-restful-table';
import { ChangeEvent, PureComponent } from 'react';

import userStore from '../models/User';

@observer
export class FileUploader extends PureComponent<FilePickerProps> {
  @observable
  innerValue = '';

  get value() {
    const { value, defaultValue } = this.props;

    return value || this.innerValue || defaultValue;
  }

  handleChange = async ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files?.[0]) return;

    this.innerValue = URL.createObjectURL(files[0]);

    const path = await userStore.upload(files[0]);

    URL.revokeObjectURL(this.innerValue);

    this.innerValue = path;
  };

  render() {
    const { name, ...props } = this.props,
      { value } = this;

    return (
      <>
        <input type="hidden" name={name} value={value} />

        <FilePicker {...props} value={value} onChange={this.handleChange} />
      </>
    );
  }
}
