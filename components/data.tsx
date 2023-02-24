import { Gender, Role } from '@ideamall/data-model';

import { i18n } from '../models/Translation';

export const GenderSymbol = {
  [Gender.Female]: <span className="text-danger">♀</span>,
  [Gender.Male]: <span className="text-primary">♂</span>,
  [Gender.Other]: <span className="text-secondary">?</span>,
};

const { t } = i18n;

export const RoleName = () => ({
  [Role.Administrator]: t('administrator'),
  [Role.Manager]: t('manager'),
  [Role.Client]: t('client'),
});
