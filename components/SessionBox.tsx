import { Guard } from '@authing/guard';
import { MouseEvent, PureComponent } from 'react';

export const guard = new Guard({
  mode: 'modal',
  appId: process.env.NEXT_PUBLIC_AUTHING_APP_ID!,
});

export class SessionBox extends PureComponent {
  closeModal = () => {
    guard.hide();

    document.scrollingElement?.classList.remove('overflow-hidden');
  };

  openModal = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    document.scrollingElement?.classList.add('overflow-hidden');

    guard.on('close', this.closeModal);

    const user = await guard.start('#authing-modal');

    this.closeModal();

    console.log(user);
  };

  render() {
    const { children } = this.props;

    return <div onClickCapture={this.openModal}>{children}</div>;
  }
}
