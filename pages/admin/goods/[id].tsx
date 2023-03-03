import { Loading, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FormField } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';

import { AdminFrame } from '../../../components/AdminFrame';
import categoryStore from '../../../models/Category';
import goodsStore from '../../../models/Goods';
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
  componentDidMount() {
    categoryStore.getAll();
  }

  renderCategory() {
    const { downloading, allItems } = categoryStore;

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
    const { uploading } = goodsStore;

    return (
      <Form className="d-flex flex-column gap-3">
        <FormField
          label={t('name')}
          placeholder={t('name')}
          name="name"
          required
        />
        {this.renderCategory()}

        <FormField
          label={t('extra_style_name')}
          placeholder={t('extra_style_name')}
        />
        <FormField
          label={t('extra_style_values')}
          placeholder={t('extra_style_values')}
        />
        <Form.Group>
          <Form.Label>{t('detail')}</Form.Label>
          <HTMLEditor />
        </Form.Group>

        <SpinnerButton className="w-100" type="submit" loading={uploading > 0}>
          {t('submit')}
        </SpinnerButton>
      </Form>
    );
  }
}
