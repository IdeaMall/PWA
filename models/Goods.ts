import { GoodsOutput } from '@ideamall/data-model';

import { TableModel } from './Base';
import userStore from './User';

export class GoodsModel extends TableModel<GoodsOutput> {
  client = userStore.client;
  baseURI = 'goods';
}

export default new GoodsModel();
