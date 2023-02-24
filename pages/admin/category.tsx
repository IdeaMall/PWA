import { CategoryInput } from '@ideamall/data-model';
import { Loading, SpinnerButton } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { createRef, FormEvent, MouseEvent, PureComponent } from 'react';
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { AdminFrame } from '../../components/AdminFrame';
import categoryStore, { CategoryNode } from '../../models/Category';
import { i18n } from '../../models/Translation';
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

const { t } = i18n;

@observer
class CategoryAdmin extends PureComponent {
  form = createRef<HTMLFormElement>();

  @observable
  current = {} as CategoryMeta;

  componentDidMount() {
    categoryStore.getAll();
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { id, ...data } = formToJSON<CategoryMeta>(form);

    await categoryStore.updateOne(data, id);
  };

  handleRemove = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const form = this.form.current!;
    const { id, name } = formToJSON<CategoryMeta>(form);

    if (!confirm(t('sure_to_delete_x', { keys: [name] }))) return;

    await categoryStore.deleteOne(id!);

    this.current = {} as CategoryMeta;
    form.reset();
  };

  renderForm() {
    const { id, name, parentId } = this.current,
      { uploading, allItems } = categoryStore;

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

        <SpinnerButton className="w-100" type="submit" loading={uploading > 0}>
          {t('submit')}
        </SpinnerButton>

        {id && (
          <SpinnerButton
            className="w-100"
            variant="danger"
            loading={uploading > 0}
            onClick={this.handleRemove}
          >
            {t('delete')}
          </SpinnerButton>
        )}
      </Col>
    );
  }

  renderTree({ id, name, parentId, subs }: CategoryNode) {
    return (
      <details key={name} className="ps-3" open>
        <summary onClick={() => (this.current = { id, name, parentId })}>
          {name}
        </summary>
        {subs?.map(node => this.renderTree(node))}
      </details>
    );
  }

  render() {
    const { downloading, tree } = categoryStore;

    return (
      <Row xs={1} sm={2}>
        {downloading > 0 && <Loading />}

        {this.renderForm()}

        <Col as="nav">{tree.subs?.map(node => this.renderTree(node))}</Col>
      </Row>
    );
  }
}
