import { Role } from '@ideamall/data-model';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import { i18n } from '../models/Translation';
import userStore from '../models/User';
import { SessionBox } from './SessionBox';

const { t } = i18n;

export const UserMenu: FC = observer(() => {
  const { session } = userStore;

  return (
    <SessionBox>
      {session ? (
        <DropdownButton title={session.nickName || session.mobilePhone}>
          {!session.roles?.includes(Role.Client) && (
            <Dropdown.Item href="/admin">{t('dashboard')}</Dropdown.Item>
          )}
          <Dropdown.Item onClick={() => userStore.signOut()}>
            {t('sign_out')}
          </Dropdown.Item>
        </DropdownButton>
      ) : (
        <Button>{t('sign_in')}</Button>
      )}
    </SessionBox>
  );
});
