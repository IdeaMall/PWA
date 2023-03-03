import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Pager } from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Button, Table } from 'react-bootstrap';
import { parseURLData } from 'web-utility';

import { AdminFrame } from '../../../components/AdminFrame';
import { isServer } from '../../../models/Base';
import goodsStore from '../../../models/Goods';
import { i18n } from '../../../models/Translation';

export default function GoodsAdminPage() {
  return (
    <AdminFrame>
      <GoodsAdmin />
    </AdminFrame>
  );
}

const { t } = i18n;

@observer
class GoodsAdmin extends PureComponent {
  componentDidMount() {
    if (isServer()) return;

    const { pageIndex = 1, pageSize } = parseURLData();
    // @ts-ignore
    goodsStore.getList({}, pageIndex, pageSize);
  }

  render() {
    const { downloading, pageIndex, pageSize, pageCount, currentPage } =
      goodsStore;

    return (
      <>
        <header className="d-flex justify-content-between sticky-top bg-white">
          <Pager {...{ pageIndex, pageSize, pageCount }} />
          <div>
            <Button href="/admin/goods/0">{t('create')}</Button>
          </div>
        </header>

        {downloading > 0 && <Loading />}

        <Table responsive striped hover className="text-center">
          <thead>
            <th>{t('name')}</th>
          </thead>
          <tbody>
            {currentPage.map(({ id, name }) => (
              <tr key={id}>
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}
