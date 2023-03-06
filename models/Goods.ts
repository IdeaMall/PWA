import { GoodsItemOutput, GoodsOutput } from '@ideamall/data-model';
import { observable } from 'mobx';

import { TableModel } from './Base';
import userStore from './User';

export class GoodsModel extends TableModel<GoodsOutput> {
  client = userStore.client;
  baseURI = 'goods';

  @observable
  currentItemStore?: GoodsItemModel;

  itemStoreOf(goodsId: number) {
    return (this.currentItemStore = new GoodsItemModel(goodsId));
  }

  async getOne(id: number) {
    const item = await super.getOne(id);

    this.itemStoreOf(id);

    return item;
  }
}

export class GoodsItemModel extends TableModel<GoodsItemOutput> {
  client = userStore.client;
  baseURI = '';

  constructor(goodsId: number) {
    super();
    this.baseURI = `goods/${goodsId}/item`;
  }
}
