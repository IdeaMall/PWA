import { Goods, Role } from '@ideamall/data-service';
import { Loading, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FormField } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Component, FormEvent } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON, makeArray } from 'web-utility';

import { AddressList } from '../../../components/Address';
import { GoodsItemTable } from '../../../components/Goods/ItemTable';
import { GoodsStyleEditor } from '../../../components/Goods/StyleEditor';
import { AdminFrame } from '../../../components/Layout/AdminFrame';
import { AddressModel } from '../../../models/Address';
import { CategoryModel } from '../../../models/Category';
import fileStore from '../../../models/File';
import { GoodsModel } from '../../../models/Goods';
import { t } from '../../../models/Translation';

const SessionBox = dynamic(
  () => import('../../../components/Session/SessionBox'),
  { ssr: false },
);
const HTMLEditor = dynamic(() => import('../../../components/HTMLEditor'), {
  ssr: false,
});
HTMLEditor.displayName = 'HTMLEditor';

export const getServerSideProps = compose<
  { id: string },
  RouteProps<{ id: string }>
>(router);

export default function GoodsEditorPage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <SessionBox autoCover roles={[Role.Administrator, Role.Manager]}>
      <AdminFrame>
        <GoodsEditor id={params!.id} />
      </AdminFrame>
    </SessionBox>
  );
}

@observer
class GoodsEditor extends Component<{ id: string }> {
  categoryStore = new CategoryModel();
  addressStore = new AddressModel();
  goodsStore = new GoodsModel();

  get isCreate() {
    return !+this.props.id;
  }

  componentDidMount() {
    this.categoryStore.getAll();

    const id = +this.props.id;

    if (id) this.goodsStore.getOne(id);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { styles, ...data } = formToJSON<Goods>(event.currentTarget);

    await this.goodsStore.updateOne(
      {
        ...data,
        // @ts-expect-error Back-end type error
        styles: styles && makeArray(styles),
      },
      this.goodsStore.currentOne.id,
    );

    if (this.isCreate) location.href = '/admin/goods';
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
    const { goodsStore, isCreate } = this;
    const { currentOne, currentItemStore } = goodsStore;

    const { id, name, category, styles, store, description } = currentOne,
      fileUploading = fileStore.uploading > 0,
      dataDownloading = goodsStore.downloading > 0,
      uploading = goodsStore.uploading > 0 || fileUploading;

    return (
      <>
        {(dataDownloading || fileUploading) && <Loading />}

        <Form className="d-flex flex-column gap-3" onSubmit={this.handleSubmit}>
          <FormField
            label={t('name')}
            placeholder={t('name')}
            name="name"
            required
            defaultValue={name}
          />
          {this.renderCategory(category?.id)}

          {(isCreate || styles) && (
            <GoodsStyleEditor defaultValue={styles || []} />
          )}
          <Form.Group>
            <Form.Label>{t('detail')}</Form.Label>

            {!dataDownloading && (
              <HTMLEditor name="description" defaultValue={description} />
            )}
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
            <SpinnerButton className="w-100" type="submit" loading={uploading}>
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
