import { GoodsInput } from '@ideamall/data-model';
import { Loading, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FormField } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { FormEvent, PureComponent } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON, makeArray } from 'web-utility';

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

export const getServerSideProps = withRoute<{ id: string }>();

export default function GoodsEditorPage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AdminFrame>
      <GoodsEditor id={params!.id} />
    </AdminFrame>
  );
}

const { t } = i18n;

@observer
class GoodsEditor extends PureComponent<{ id: string }> {
  categoryStore = new CategoryModel();
  addressStore = new AddressModel();
  goodsStore = new GoodsModel();

  description = '';

  componentDidMount() {
    this.categoryStore.getAll();

    const id = +this.props.id;

    if (id) this.goodsStore.getOne(id);
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { styles, ...data } = formToJSON<GoodsInput>(event.currentTarget);

    this.goodsStore.updateOne(
      {
        ...data,
        // @ts-ignore
        styles: styles && makeArray(styles),
        description: this.description || this.goodsStore.currentOne.description,
      },
      +this.props.id,
    );
  };

  renderCategory(defaultValue = 1) {
    const { downloading, allItems } = this.categoryStore;

    return (
      <FloatingLabel controlId="category" label={t('categories')}>
        {downloading > 0 && <Loading />}

        <Form.Select name="category" aria-label={t('categories')}>
          {allItems.map(({ id, name }) => (
            <option key={id} value={id} selected={id === defaultValue}>
              {name}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    );
  }

  render() {
    const { uploading, currentOne, currentItemStore } = this.goodsStore;
    const { id, name, category, styles, store, description } = currentOne;

    return (
      <>
        <Form className="d-flex flex-column gap-3" onSubmit={this.handleSubmit}>
          <FormField
            label={t('name')}
            placeholder={t('name')}
            name="name"
            required
            defaultValue={name}
          />
          {this.renderCategory(category?.id)}

          {styles && <GoodsStyleEditor defaultValue={styles} />}

          <Form.Group>
            <Form.Label>{t('detail')}</Form.Label>

            <HTMLEditor
              defaultValue={description}
              onChange={value => (this.description = value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t('address')}</Form.Label>

            <AddressList
              store={this.addressStore}
              name="store"
              defaultValue={store?.id}
            />
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

        {currentItemStore && (
          <GoodsItemTable
            goodsId={id}
            styleMeta={styles}
            store={currentItemStore}
          />
        )}
      </>
    );
  }
}
