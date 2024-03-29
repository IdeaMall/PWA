import { Role } from '@ideamall/data-service';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import Head from 'next/head';
import { Component, MouseEvent, PropsWithChildren } from 'react';

import userStore, { guard } from '../models/User';

export type SessionBoxProps = PropsWithChildren<{
  className?: string;
  autoCover?: boolean;
  roles?: Role[];
}>;

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

  closeModal = () => {
    guard.hide();

    document.scrollingElement?.classList.remove('overflow-hidden');
  };

  async openModal() {
    if (+new Date(localStorage.tokenExpiredAt) > Date.now()) return;

    document.scrollingElement?.classList.add('overflow-hidden');

    guard.on('close', this.closeModal);
    guard.on('login-error', this.closeModal);

    const { token, tokenExpiredAt } = await guard.start('#authing-modal');

    localStorage.tokenExpiredAt = tokenExpiredAt;

    await userStore.signInAuthing(token!);

    this.closeModal();
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { className, autoCover, children } = this.props,
      { authorized } = this;

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.authing.co/packages/guard/5.2.0/guard.min.css"
          />
        </Head>
        <div
          className={className}
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
