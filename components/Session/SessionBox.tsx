import { Role } from '@ideamall/data-service';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import { Component, HTMLAttributes, MouseEvent } from 'react';

import { t } from '../../models/Translation';
import userStore from '../../models/User';
import { captchaDialog } from './Captcha';
import { mobilePhoneDialog, signWithSMSCode } from './SMSCode';

export interface SessionBoxProps extends HTMLAttributes<HTMLDivElement> {
  autoCover?: boolean;
  roles?: Role[];
}

@observer
@observePropsState
export default class SessionBox extends Component<SessionBoxProps> {
  declare observedProps: SessionBoxProps;

  @computed
  get authorized() {
    const { roles } = this.observedProps,
      { session } = userStore;

    return !!(roles
      ? session?.roles?.some(role => roles?.includes(role))
      : session);
  }

  componentDidMount() {
    const { autoCover } = this.props;

    if (autoCover) this.openModal();
  }

  async openModal() {
    const captcha = await captchaDialog.open();

    const smsCodeInput = await mobilePhoneDialog.open(captcha);

    await userStore.createSMSCode(smsCodeInput);

    const signInData = await signWithSMSCode.open(smsCodeInput);

    await userStore.signIn(signInData);

    alert(t('sign_in_successfully'));
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { autoCover, children, ...props } = this.props,
      { authorized } = this;

    return (
      <>
        <captchaDialog.Component />
        <mobilePhoneDialog.Component />
        <signWithSMSCode.Component />
        <div
          {...props}
          onClickCapture={
            autoCover || authorized ? undefined : this.captureInput
          }
        >
          {(!autoCover || authorized) && children}
        </div>
      </>
    );
  }
}
