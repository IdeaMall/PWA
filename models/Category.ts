import { CategoryOutput } from '@ideamall/data-model';
import { computed } from 'mobx';

import { TableModel } from './Base';
import userStore from './User';

export interface CategoryNode extends CategoryOutput {
  subs?: CategoryNode[];
}

export class CategoryModel extends TableModel<CategoryOutput> {
  client = userStore.client;
  baseURI = 'category';

  @computed
  get tree() {
    const { 0: root } = this.allItems.reduce(
      (cache, current) => {
        current = { ...current };

        cache[current.id] = current;

        const parent = cache[current.parentId || 0];

        (parent.subs ||= []).push(current);

        return cache;
      },
      { 0: {} as CategoryNode } as Record<number, CategoryNode>,
    );

    return root;
  }
}

export default new CategoryModel();
