import { observer } from 'mobx-react';
import { MouseEvent, PureComponent } from 'react';

import userStore, { guard } from '../models/User';

export interface SessionBoxProps {
  autoCover?: boolean;
}

@observer
export class SessionBox extends PureComponent<SessionBoxProps> {
  componentDidMount() {
    const { autoCover } = this.props;

    if (autoCover) this.openModal();
  }

  closeModal = () => {
    guard.hide();

    document.scrollingElement?.classList.remove('overflow-hidden');
  };

  async openModal() {
    document.scrollingElement?.classList.add('overflow-hidden');

    guard.on('close', this.closeModal);

    const { token } = await guard.start('#authing-modal');

    await userStore.signInAuthing(token!);

    this.closeModal();
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { autoCover, children } = this.props,
      { session } = userStore;

    return (
      <div onClickCapture={autoCover ? undefined : this.captureInput}>
        {(!autoCover || session) && children}
      </div>
    );
  }
}
