import { Gender, Role, User } from '@ideamall/data-service';
import { Avatar } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { Container, Form } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import { GenderSymbol, RoleName } from '../../components/data';
import { i18n } from '../../models/Translation';
import userStore from '../../models/User';

const SessionBox = dynamic(() => import('../../components/SessionBox'), {
  ssr: false,
});

export default function UserAdminPage() {
  return (
    <SessionBox autoCover roles={[Role.Administrator, Role.Manager]}>
      <AdminFrame>
        <UserAdmin />
      </AdminFrame>
    </SessionBox>
  );
}

const { t } = i18n;

@observer
class UserAdmin extends PureComponent {
  @computed
  get columns(): Column<User>[] {
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
          translator={i18n}
          onCheck={console.log}
        />
      </Container>
    );
  }
}
