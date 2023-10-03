import { Address, AddressOwner } from '@ideamall/data-service';
import { NewData } from 'mobx-restful';

import { TableModel } from './Base';
import userStore from './User';

export class AddressModel extends TableModel<Address> {
  client = userStore.client;
  baseURI = '';

  constructor(public ownership = AddressOwner.Seller) {
    super();
    this.baseURI = ownership ? 'user/session/address' : 'address';
  }

  updateOne(data: Partial<NewData<Address>>, id?: number) {
    return super.updateOne({ ...data, ownership: this.ownership }, id);
  }
}
