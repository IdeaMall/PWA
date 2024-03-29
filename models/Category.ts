import { Category } from '@ideamall/data-service';
import { computed } from 'mobx';

import { TableModel } from './Base';
import userStore from './User';

export interface CategoryNode extends Category {
  subs?: CategoryNode[];
}

export class CategoryModel extends TableModel<Category> {
  client = userStore.client;
  baseURI = 'category';

  @computed
  get tree() {
    const { 0: root } = this.allItems
      .sort(({ id: a }, { id: b }) => a - b)
      .reduce(
        (cache, current) => {
          current = { ...current };

          cache[current.id] = current;

          const parent = cache[current.parentId || 0];

          if (parent) (parent.subs ||= []).push(current);

          return cache;
        },
        { 0: {} as CategoryNode } as Record<number, CategoryNode>,
      );

    return root;
  }
}
