import { Gender, UserOutput } from '@ideamall/data-model';
import { Avatar } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Container, Form } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import { GenderSymbol, RoleName } from '../../components/data';
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

const { t } = i18n;

@observer
class UserAdmin extends PureComponent {
  @computed
  get columns(): Column<UserOutput>[] {
    return [
      {
        key: 'mobilePhone',
        renderHead: t('mobile_phone'),
        renderBody: ({ mobilePhone }) => (
          <a href={`tel:${mobilePhone}`}>{mobilePhone}</a>
        ),
      },
      { key: 'nickName', renderHead: t('nick_name') },
      {
        key: 'gender',
        renderHead: t('gender'),
        renderBody: ({ gender }) => GenderSymbol[gender ?? Gender.Other],
      },
      {
        key: 'avatar',
        renderHead: t('avatar'),
        renderBody: ({ avatar }) => <Avatar src={avatar} />,
      },
      {
        key: 'roles',
        renderHead: t('roles'),
        renderBody: ({ id, roles, ...user }) => (
          <Form.Select
            value={Math.min(...(roles || []))}
            onChange={({ currentTarget: { value } }) =>
              // @ts-ignore
              userStore.updateOne({ ...user, roles: [+value] }, id)
            }
          >
            {Object.entries(RoleName()).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </Form.Select>
        ),
      },
    ];
  }

  render() {
    return (
      <Container style={{ height: '91vh' }}>
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
