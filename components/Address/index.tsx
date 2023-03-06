import { AddressOutput } from '@ideamall/data-model';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';

import { AddressModel } from '../../models/Address';
import { i18n } from '../../models/Translation';
import { AddressCard } from './Card';

export interface AddressListProps extends ScrollListProps<AddressOutput> {
  store: AddressModel;
}

export class AddressList extends ScrollList<AddressListProps> {
  translator = i18n;
  store = this.props.store;

  constructor(props: AddressListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    const { allItems } = this.store;

    return (
      <ul className="list-unstyled">
        {allItems.map(item => (
          <AddressCard as="li" key={item.id} {...item} />
        ))}
      </ul>
    );
  }
}
