import { setSeederFactory } from 'typeorm-extension';
import { UserDetailOrmEntity } from '@userModule/infrastructure/entities/user-detail.orm-entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory<UserDetailOrmEntity>(
  UserDetailOrmEntity,
  () => {
    const userDetails = new UserDetailOrmEntity();
    userDetails.address = faker.location.streetAddress();
    userDetails.phoneNumber = faker.phone.number();
    userDetails.profilePictureUrl = faker.image.avatar();
    userDetails.biography = faker.lorem.paragraph();
    return userDetails;
  },
);
