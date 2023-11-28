import { Goods, Role } from '@ideamall/data-service';
import { Loading, text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { Pager } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { parseURLData } from 'web-utility';

import { AddressText } from '../../../components/Address/Card';
import { AdminFrame } from '../../../components/AdminFrame';
import { isServer } from '../../../models/Base';
import { GoodsModel } from '../../../models/Goods';
import { i18n } from '../../../models/Translation';

const SessionBox = dynamic(() => import('../../../components/SessionBox'), {
  ssr: false,
});

export default function GoodsAdminPage() {
  return (
    <SessionBox autoCover roles={[Role.Administrator, Role.Manager]}>
      <AdminFrame>
        <GoodsAdmin />
      </AdminFrame>
    </SessionBox>
  );
}

const { t } = i18n;

@observer
class GoodsAdmin extends PureComponent {
  store = new GoodsModel();

  componentDidMount() {
    if (isServer()) return;

    const { pageIndex = 1, pageSize } = parseURLData();
    // @ts-ignore
    this.store.getList({}, pageIndex, pageSize);
  }

  renderRow = ({ id, name, category, styles, store, items }: Goods) => (
    <tr key={id} className="align-middle">
      <td>{name}</td>
      <td>{category.name}</td>
      <td>
        <ul className="list-styled m-0">
          {styles?.map(({ name, values }) => (
            <li key={name} className="d-flex gap-2 align-items-center">
              {name}
              {values.map(value => (
                <Badge key={value} bg={text2color(value, ['light'])}>
                  {value}
                </Badge>
              ))}
            </li>
          ))}
        </ul>
      </td>
      <td>
        <AddressText {...store} />
      </td>
      <td>{items?.length || 0}</td>
      <td>
        <Button variant="warning" size="sm" href={`/admin/goods/${id}`}>
          {t('edit')}
        </Button>
      </td>
    </tr>
  );

  render() {
    const { downloading, pageIndex, pageSize, pageCount, currentPage } =
      this.store;

    return (
      <>
        <header className="d-flex justify-content-between sticky-top py-3 bg-white">
          <Pager {...{ pageIndex, pageSize, pageCount }} />
          <div>
            <Button href="/admin/goods/0">{t('create')}</Button>
          </div>
        </header>

        {downloading > 0 && <Loading />}

        <Table responsive striped hover className="text-center">
          <thead>
            <th>{t('name')}</th>
            <th>{t('categories')}</th>
            <th>{t('extra_style_values')}</th>
            <th>{t('address')}</th>
            <th>{t('goods_items')}</th>
            <th></th>
          </thead>
          <tbody>{currentPage.map(this.renderRow)}</tbody>
        </Table>
      </>
    );
  }
}
