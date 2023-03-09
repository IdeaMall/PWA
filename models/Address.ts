import { AddressOutput, AddressOwner } from '@ideamall/data-model';
import { NewData } from 'mobx-restful';

import { TableModel } from './Base';
import userStore from './User';

export class AddressModel extends TableModel<AddressOutput> {
  client = userStore.client;
  baseURI = '';

  constructor(public ownership = AddressOwner.Seller) {
    super();
    this.baseURI = ownership ? 'user/session/address' : 'address';
  }

  updateOne(data: Partial<NewData<AddressOutput>>, id?: number) {
    return super.updateOne({ ...data, ownership: this.ownership }, id);
  }
}
