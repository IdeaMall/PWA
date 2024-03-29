import { Category, Role, UserInputData } from '@ideamall/data-service';
import { ClickBoundary, Loading, SpinnerButton } from 'idea-react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FileUploader } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { createRef,FormEvent, MouseEvent, PureComponent } from 'react';
import { Col, FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { AdminFrame } from '../../components/AdminFrame';
import { CategoryModel, CategoryNode } from '../../models/Category';
import fileStore from '../../models/File';
import { i18n } from '../../models/Translation';
import userStore from '../../models/User';

const SessionBox = dynamic(() => import('../../components/SessionBox'), {
  ssr: false,
});

export default function CategoryAdminPage() {
  return (
    <SessionBox autoCover roles={[Role.Administrator, Role.Manager]}>
      <AdminFrame>
        <CategoryAdmin />
      </AdminFrame>
    </SessionBox>
  );
}

interface CategoryMeta extends UserInputData<Category> {
  id?: number;
}

const { t } = i18n;

@observer
class CategoryAdmin extends PureComponent {
  constructor(props: {}) {
    super(props);
    makeObservable(this);
  }

  form = createRef<HTMLFormElement>();
  store = new CategoryModel();

  @observable
  current = {} as CategoryMeta;

  @computed
  get uploading() {
    return (
      userStore.uploading > 0 ||
      this.store.uploading > 0 ||
      fileStore.uploading > 0
    );
  }

  componentDidMount() {
    this.store.getAll();
  }

  clearForm = () => {
    this.current = {} as CategoryMeta;
    this.form.current?.reset();
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { id, ...data } = formToJSON<CategoryMeta>(event.currentTarget);

    await this.store.updateOne(data, id);

    this.clearForm();
  };

  handleRemove = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { id, name } = formToJSON<CategoryMeta>(event.currentTarget.form!);

    if (!confirm(t('sure_to_delete_x', { keys: [name] }))) return;

    await this.store.deleteOne(id!);

    this.clearForm();
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

        <Form.Group>
          <Form.Label>{t('image')}</Form.Label>

          <FileUploader
            store={fileStore}
            accept="image/*"
            name="image"
            value={image}
            onChange={value =>
              (this.current = { ...this.current, image: value + '' })
            }
          />
        </Form.Group>

        <FloatingLabel controlId="parentId" label={t('parent')}>
          <Form.Select
            name="parentId"
            aria-label={t('parent')}
            value={parentId || ''}
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
      <ClickBoundary
        className="row row-cols-1 row-cols-sm-2"
        onOuterClick={this.clearForm}
      >
        {downloading > 0 && <Loading />}

        {this.renderForm()}

        <Col as="nav">{tree.subs?.map(node => this.renderTree(node))}</Col>
      </ClickBoundary>
    );
  }
}
