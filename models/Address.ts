import { AddressOutput } from '@ideamall/data-model';

import { TableModel } from './Base';
import userStore from './User';

export class AddressModel extends TableModel<AddressOutput> {
  client = userStore.client;
  baseURI = '';

  constructor(sessionScope = false) {
    super();
    this.baseURI = sessionScope ? 'user/session/address' : 'address';
  }
}
