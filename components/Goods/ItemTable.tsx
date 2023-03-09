import { GoodsItemOutput } from '@ideamall/data-model';
import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Badge } from 'react-bootstrap';

import { GoodsItemModel } from '../../models/Goods';
import { i18n } from '../../models/Translation';

const { t } = i18n;

@observer
export class GoodsItemTable extends PureComponent<{ store: GoodsItemModel }> {
  get columns(): Column<GoodsItemOutput>[] {
    return [
      { key: 'name', renderHead: t('name') },
      { key: 'image', type: 'file', accept: 'image/*', renderHead: t('image') },
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
