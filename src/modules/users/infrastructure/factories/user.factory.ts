import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

dotenv.config();

export class UserFactory {
  private repository: Repository<UserOrmEntity>;
  private saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserOrmEntity);
  }
  async createRandomUser(): Promise<UserOrmEntity> {
    const user = new UserOrmEntity();
    user.username =
      faker.internet.username() + faker.number.int({ min: 1, max: 1000000 });
    user.email = faker.internet.email();
    user.password = await bcrypt.hash(
      process.env.DEFAULT_PASSWORD || '',
      this.saltRounds,
    ); // RANDOM PASSWORD (hashing HANDLED BY ORM )
    user.isActive = true;
    user.isEmailVerified = true;
    return user;
  }
  async createAdminUser(): Promise<UserOrmEntity> {
    const user = new UserOrmEntity();
    user.username = 'simonetta_tamagni';
    user.email = 'simonetta@tamagnipianoforti.com';
    user.password = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD || '',
      this.saltRounds,
    );
    user.isActive = true;
    user.isEmailVerified = true;

    return user;
  }
}
