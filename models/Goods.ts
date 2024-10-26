import { Goods, GoodsItem } from '@ideamall/data-service';
import { observable } from 'mobx';

import { TableModel } from './Base';
import userStore from './User';

export class GoodsModel extends TableModel<Goods> {
  client = userStore.client;
  baseURI = 'goods';

  @observable
  accessor currentItemStore: GoodsItemModel | undefined;

  itemStoreOf(goodsId: number) {
    return (this.currentItemStore = new GoodsItemModel(goodsId));
  }

  async getOne(id: number) {
    const item = await super.getOne(id);

    this.itemStoreOf(id);

    return item;
  }
}

export class GoodsItemModel extends TableModel<GoodsItem> {
  client = userStore.client;
  baseURI = '';

  constructor(goodsId: number) {
    super();
    this.baseURI = `goods/${goodsId}/item`;
  }
}
