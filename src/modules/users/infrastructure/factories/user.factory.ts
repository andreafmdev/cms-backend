import { setSeederFactory } from 'typeorm-extension';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export default setSeederFactory<UserOrmEntity>(UserOrmEntity, async () => {
  const user = new UserOrmEntity();
  user.username = faker.internet.userName();
  user.email = faker.internet.email();

  const saltOrRounds = 10;
  const password = 'random_password';

  try {
    user.password = await bcrypt.hash(password, saltOrRounds); // Hash sicuro
  } catch (error) {
    console.error("Errore durante l'hashing della password:", error);
    user.password = password; // Assegna una password non hashata in caso di errore
  }

  return user;
});
