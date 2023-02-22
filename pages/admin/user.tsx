import { UserOutput } from '@ideamall/data-model';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import { PageHead } from '../../components/PageHead';
import { i18n } from '../../models/Translation';
import userStore from '../../models/User';
import { withTranslation } from '../api/core';

export const getServerSideProps = withTranslation();

export default function UserAdminPage() {
  return (
    <AdminFrame>
      <UserAdmin />
    </AdminFrame>
  );
}

@observer
class UserAdmin extends PureComponent {
  @computed
  get columns(): Column<UserOutput>[] {
    const { t } = i18n;

    return [
      {
        key: 'mobilePhone',
        renderHead: t('repository_name'),
        renderBody: ({ mobilePhone }) => (
          <a href={`tel:${mobilePhone}`}>{mobilePhone}</a>
        ),
      },
      { key: 'nickName', renderHead: t('home_page') },
      { key: 'gender', renderHead: t('programming_language') },
      {
        key: 'avatar',
        type: 'file',
        accept: 'image/*',
        renderHead: t('star_count'),
      },
      {
        key: 'roles',
        renderHead: t('topic'),
        renderBody: ({ roles }) => (
          <>
            {roles?.map(role => (
              <Badge key={role} className="me-2">
                {role}
              </Badge>
            ))}
          </>
        ),
      },
    ];
  }

  render() {
    const { t } = i18n;

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title={t('pagination')} />

        <RestTable
          className="text-center"
          striped
          hover
          deletable
          columns={this.columns}
          store={userStore}
          translater={i18n}
          onCheck={console.log}
        />
      </Container>
    );
  }
}
