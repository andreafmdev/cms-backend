import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { faker } from '@faker-js/faker';
import { PermissionFactory } from '../factories/permission.factory';
import { GroupFactory } from '../factories/group.factory';
import { UserDetailOrmEntity } from '@userModule/infrastructure/entities/user-detail.orm-entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('🚀 Running UserSeeder...');

    // Ottieni repository e factory
    const permissionFactory = new PermissionFactory(dataSource);
    const groupFactory = new GroupFactory(dataSource);
    const userFactory = factoryManager.get(UserOrmEntity);
    const userDetailFactory = factoryManager.get(UserDetailOrmEntity);
    const userRepository = dataSource.getRepository(UserOrmEntity);

    const groupRepository = dataSource.getRepository(GroupOrmEntity);
    const userDetailRepository = dataSource.getRepository(UserDetailOrmEntity);

    try {
      // 1️⃣ Crea Permessi
      console.log('⚙️ Creazione dei permessi...');
      const permissions = await permissionFactory.createDefaultPermissions();
      console.log(`✅ ${permissions.length} permessi creati.`);

      // 2️⃣ Crea Gruppi con Permessi Associati
      console.log('⚙️ Creazione dei gruppi con permessi...');
      const groups = await groupFactory.createDefaultGroups();
      console.log(`✅ ${groups.length} gruppi creati.`);
      // 3️⃣ Associa i permessi ai gruppi
      const updatedGroups = groups.map((group) => {
        group.permissions = faker.helpers.arrayElements(permissions, 3); // Assegna 3 permessi casuali
        return group;
      });
      // 4️⃣ Salva i gruppi con i permessi aggiornati
      await groupRepository.save(updatedGroups);
      console.log(`✅ ${updatedGroups.length} gruppi aggiornati con permessi.`);

      // 5️⃣ Crea Utenti e Assegna Gruppi
      console.log('⚙️ Creazione degli utenti con gruppi...');
      const users = await Promise.all(
        Array.from({ length: 5 }).map(async () => {
          //CREATE USER DETAIL
          const userDetails = await userDetailFactory.make();

          const user = await userFactory.make();
          user.groups = faker.helpers.arrayElements(updatedGroups, 1); // Assegna 1 gruppo casuale
          user.details = userDetails;
          // Salva l'utente
          await userDetailRepository.save(userDetails);
          return await userRepository.save(user);
        }),
      );
      console.log(`✅ ${users.length} utenti creati.`);

      console.log('🎉 UserSeeder completato con successo!');
    } catch (error) {
      console.error('❌ Errore durante il seeding:', error);
    }
  }
}
