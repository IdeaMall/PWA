import { GoodsItemOutput, GoodsStyle } from '@ideamall/data-model';
import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import {
  Column,
  FileUploader,
  ImagePreview,
  RestTable,
} from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Badge, Form } from 'react-bootstrap';

import fileStore from '../../models/File';
import { GoodsItemModel } from '../../models/Goods';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export interface GoodsItemTableProps {
  goodsId: number;
  styleMeta?: GoodsStyle[];
  store: GoodsItemModel;
}

@observer
export class GoodsItemTable extends PureComponent<GoodsItemTableProps> {
  get columns(): Column<GoodsItemOutput>[] {
    const { goodsId } = this.props;

    return [
      {
        renderInput: () => <input type="hidden" name="goods" value={goodsId} />,
      },
      { key: 'name', renderHead: t('name') },
      {
        key: 'image',
        renderHead: t('image'),
        renderBody: ({ image }) => (
          <ImagePreview style={{ height: '5rem' }} src={image} />
        ),
        renderInput: ({ image }) => (
          <Form.Group className="mb-3">
            <Form.Label>{t('image')}</Form.Label>

            <FileUploader
              store={fileStore}
              accept="image/*"
              name="image"
              defaultValue={image}
            />
          </Form.Group>
        ),
      },
      {
        key: 'price',
        type: 'number',
        renderHead: t('price'),
        renderBody: ({ price }) => `￥${price}`,
      },
      {
        key: 'kilogram',
        type: 'number',
        renderHead: t('weight'),
        renderBody: ({ kilogram }) => `${kilogram}kg`,
      },
      { key: 'code', renderHead: t('code') },
      {
        key: 'styles',
        renderHead: t('styles'),
        renderBody: ({ styles }) =>
          styles &&
          Object.entries(styles).map(item => {
            const style = item.join('-');

            return (
              <Badge
                key={style}
                className="me-3"
                bg={text2color(style, ['light'])}
              >
                {style}
              </Badge>
            );
          }),
        renderInput: () => <></>,
      },
      { key: 'stock', type: 'number', renderHead: t('stock') },
    ];
  }

  render() {
    const { columns } = this,
      { store } = this.props;

    return (
      <RestTable
        editable
        deletable
        columns={columns}
        translator={i18n}
        store={store}
      />
    );
  }
}
