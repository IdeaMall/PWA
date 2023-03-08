import { Loading, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FormField } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { FormEvent, PureComponent } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { AddressList } from '../../../components/Address';
import { AdminFrame } from '../../../components/AdminFrame';
import { GoodsItemTable } from '../../../components/Goods/ItemTable';
import { GoodsStyleEditor } from '../../../components/Goods/StyleEditor';
import { AddressModel } from '../../../models/Address';
import { CategoryModel } from '../../../models/Category';
import { GoodsModel } from '../../../models/Goods';
import { i18n } from '../../../models/Translation';
import { withRoute } from '../../api/core';

const HTMLEditor = dynamic(() => import('../../../components/HTMLEditor'), {
  ssr: false,
});
HTMLEditor.displayName = 'HTMLEditor';

export const getServerSideProps = withRoute();

export default function GoodsEditorPage() {
  return (
    <AdminFrame>
      <GoodsEditor />
    </AdminFrame>
  );
}

const { t } = i18n;

@observer
class GoodsEditor extends PureComponent {
  categoryStore = new CategoryModel();
  addressStore = new AddressModel();
  goodsStore = new GoodsModel();

  componentDidMount() {
    this.categoryStore.getAll();
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = formToJSON(event.currentTarget);

    console.log(data);
  };

  renderCategory() {
    const { downloading, allItems } = this.categoryStore;

    return (
      <FloatingLabel controlId="category" label={t('categories')}>
        {downloading > 0 && <Loading />}

        <Form.Select name="category" aria-label={t('categories')}>
          {allItems.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    );
  }

  render() {
    const { uploading, currentOne, currentItemStore } = this.goodsStore;

    return (
      <>
        <Form className="d-flex flex-column gap-3" onSubmit={this.handleSubmit}>
          <FormField
            label={t('name')}
            placeholder={t('name')}
            name="name"
            required
          />
          {this.renderCategory()}

          <GoodsStyleEditor defaultValue={currentOne.styles} />

          <Form.Group>
            <Form.Label>{t('detail')}</Form.Label>
            <HTMLEditor />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t('address')}</Form.Label>

            <AddressList store={this.addressStore} />
          </Form.Group>

          <footer className="sticky-top bottom-0 py-3 bg-white">
            <SpinnerButton
              className="w-100"
              type="submit"
              loading={uploading > 0}
            >
              {t('submit')}
            </SpinnerButton>
          </footer>
        </Form>

        {currentItemStore && <GoodsItemTable store={currentItemStore} />}
      </>
    );
  }
}
