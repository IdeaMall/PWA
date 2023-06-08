import { CategoryInput } from '@ideamall/data-model';
import { Loading, SpinnerButton } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormField } from 'mobx-restful-table';
import {
  ChangeEvent,
  createRef,
  FormEvent,
  MouseEvent,
  PureComponent,
} from 'react';
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { AdminFrame } from '../../components/AdminFrame';
import { CategoryModel, CategoryNode } from '../../models/Category';
import fileStore from '../../models/File';
import { i18n } from '../../models/Translation';
import userStore from '../../models/User';
import { withTranslation } from '../api/core';

export const getServerSideProps = withTranslation();

export default function CategoryAdminPage() {
  return (
    <AdminFrame>
      <CategoryAdmin />
    </AdminFrame>
  );
}

interface CategoryMeta extends CategoryInput {
  id?: number;
}

interface CategoryForm extends Omit<CategoryMeta, 'image'> {
  image?: File;
}

const { t } = i18n;

@observer
class CategoryAdmin extends PureComponent {
  form = createRef<HTMLFormElement>();
  store = new CategoryModel();

  @observable
  current = {} as CategoryMeta;

  @computed
  get uploading() {
    return userStore.uploading > 0 || this.store.uploading > 0;
  }

  componentDidMount() {
    this.store.getAll();
  }

  updateImage = ({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    const file = files?.[0];

    if (!file) return;

    const { image, ...rest } = this.current;

    if (image?.startsWith('blob:')) URL.revokeObjectURL(image);

    this.current = { ...rest, image: URL.createObjectURL(file) };
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { id, image, ...data } = formToJSON<CategoryForm>(form);

    const imageURL = image && (await fileStore.upload(image));

    await this.store.updateOne({ ...data, image: imageURL }, id);
  };

  handleRemove = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const form = this.form.current!;
    const { id, name } = formToJSON<CategoryMeta>(form);

    if (!confirm(t('sure_to_delete_x', { keys: [name] }))) return;

    await this.store.deleteOne(id!);

    this.current = {} as CategoryMeta;
    form.reset();
  };

  renderForm() {
    const { uploading } = this,
      { id, name, image, parentId } = this.current,
      { allItems } = this.store;

    return (
      <Col
        as="form"
        className="d-flex flex-column gap-3"
        ref={this.form}
        onSubmit={this.handleSubmit}
      >
        <input type="hidden" name="id" value={id} />

        <FloatingLabel controlId="name" label={t('name')}>
          <Form.Control
            name="name"
            required
            placeholder={t('name')}
            value={name}
            onChange={({ currentTarget: { value } }) =>
              (this.current = { ...this.current, name: value })
            }
          />
        </FloatingLabel>

        <FormField
          label={t('image')}
          type="file"
          accept="image/*"
          name="image"
          value={image}
          onChange={this.updateImage}
        />
        <FloatingLabel controlId="parentId" label={t('parent')}>
          <Form.Select
            name="parentId"
            aria-label={t('parent')}
            value={parentId}
            onChange={({ currentTarget: { value } }) =>
              (this.current = { ...this.current, parentId: +value })
            }
          >
            <option value=""></option>

            {allItems.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>

        <SpinnerButton className="w-100" type="submit" loading={uploading}>
          {t('submit')}
        </SpinnerButton>

        {id && (
          <SpinnerButton
            className="w-100"
            variant="danger"
            loading={uploading}
            onClick={this.handleRemove}
          >
            {t('delete')}
          </SpinnerButton>
        )}
      </Col>
    );
  }

  renderTree({ name, subs, ...rest }: CategoryNode) {
    return (
      <details key={name} className="ps-3" open>
        <summary onClick={() => (this.current = { name, ...rest })}>
          {name}
        </summary>
        {subs?.map(node => this.renderTree(node))}
      </details>
    );
  }

  render() {
    const { downloading, tree } = this.store;

    return (
      <Row xs={1} sm={2}>
        {downloading > 0 && <Loading />}

        {this.renderForm()}

        <Col as="nav">{tree.subs?.map(node => this.renderTree(node))}</Col>
      </Row>
    );
  }
}
