import { Gender, Role } from '@ideamall/data-service';

import { t } from '../models/Translation';

export const GenderSymbol = {
  [Gender.Female]: <span className="text-danger">♀</span>,
  [Gender.Male]: <span className="text-primary">♂</span>,
  [Gender.Other]: <span className="text-secondary">?</span>,
};

export const RoleName = () => ({
  [Role.Administrator]: t('administrator'),
  [Role.Manager]: t('manager'),
  [Role.Client]: t('client'),
});
