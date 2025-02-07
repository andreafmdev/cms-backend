import { setSeederFactory } from 'typeorm-extension';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory<PermissionOrmEntity>(
  PermissionOrmEntity,
  () => {
    const permission = new PermissionOrmEntity();
    permission.name = `can_${faker.word.verb()}_${faker.word.noun()}`;
    return permission;
  },
);
