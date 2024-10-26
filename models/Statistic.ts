import { StatisticSummary } from '@ideamall/data-service';
import { observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';

import userStore from './User';

export class StatisticModel extends BaseModel {
  baseURI = 'statistic';
  client = userStore.client;

  @observable
  accessor summary = {} as StatisticSummary;

  @toggle('downloading')
  async getSummary() {
    const { body } = await this.client.get<StatisticSummary>(this.baseURI);

    return (this.summary = body!);
  }
}
