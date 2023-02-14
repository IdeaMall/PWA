import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import userStore from '../models/User';
import { SessionBox } from './SessionBox';

export const UserMenu: FC = observer(() =>
  userStore.session ? (
    <DropdownButton
      title={userStore.session.nickName || userStore.session.mobilePhone}
    >
      <Dropdown.Item onClick={() => userStore.signOut()}>
        Sign out
      </Dropdown.Item>
    </DropdownButton>
  ) : (
    <SessionBox>
      <Button>Sign In</Button>
    </SessionBox>
  ),
);
