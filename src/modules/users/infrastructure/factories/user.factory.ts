import { setSeederFactory } from 'typeorm-extension';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory<UserOrmEntity>(UserOrmEntity, () => {
  const user = new UserOrmEntity();
  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = 'random_password'; // RANDOM PASSWORD (hashing HANDLED BY ORM )
  return user;
});
