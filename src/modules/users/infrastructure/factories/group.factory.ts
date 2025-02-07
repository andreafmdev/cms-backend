import { setSeederFactory } from 'typeorm-extension';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory<GroupOrmEntity>(GroupOrmEntity, () => {
  const group = new GroupOrmEntity();
  group.name = faker.company.name(); // Genera un nome per il gruppo
  return group;
});
