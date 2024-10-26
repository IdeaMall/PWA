import { Role } from '@ideamall/data-service';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import { t } from '../../models/Translation';
import userStore from '../../models/User';
import SessionBox from './SessionBox';

const UserMenu: FC = observer(() => {
  const { session } = userStore;

  return session ? (
    <DropdownButton title={session.nickName || session.mobilePhone}>
      {!session.roles?.includes(Role.Client) && (
        <Dropdown.Item href="/admin">{t('dashboard')}</Dropdown.Item>
      )}
      <Dropdown.Item onClick={() => userStore.signOut()}>
        {t('sign_out')}
      </Dropdown.Item>
    </DropdownButton>
  ) : (
    <SessionBox>
      <Button>{t('sign_in')}</Button>
    </SessionBox>
  );
});

export default UserMenu;
