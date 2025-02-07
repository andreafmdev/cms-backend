import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { faker } from '@faker-js/faker';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('🚀 Running UserSeeder...');

    // Ottieni repository e factory
    const permissionFactory = factoryManager.get(PermissionOrmEntity);
    const groupFactory = factoryManager.get(GroupOrmEntity);
    const userFactory = factoryManager.get(UserOrmEntity);
    const groupRepository = dataSource.getRepository(GroupOrmEntity);

    try {
      // 1️⃣ Crea Permessi
      console.log('⚙️ Creazione dei permessi...');
      const permissions = await permissionFactory.saveMany(5); // 5 permessi casuali
      console.log(`✅ ${permissions.length} permessi creati.`);

      // 2️⃣ Crea Gruppi con Permessi Associati
      console.log('⚙️ Creazione dei gruppi con permessi...');
      const groups = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          const group = await groupFactory.make(); // Crea il gruppo
          group.permissions = faker.helpers.arrayElements(permissions, 3); // Assegna 3 permessi casuali
          return await groupRepository.save(group); // Salva il gruppo con i permessi
        }),
      );
      console.log(`✅ ${groups.length} gruppi creati.`);

      // 3️⃣ Crea Utenti e Assegna Gruppi
      console.log('⚙️ Creazione degli utenti con gruppi...');
      const users = await Promise.all(
        Array.from({ length: 5 }).map(async () => {
          const user = await userFactory.make(); // Crea l'utente
          user.groups = faker.helpers.arrayElements(groups, 2); // Assegna 2 gruppi casuali
          return await dataSource.getRepository(UserOrmEntity).save(user); // Salva l'utente con i gruppi
        }),
      );
      console.log(`✅ ${users.length} utenti creati.`);

      console.log('🎉 UserSeeder completato con successo!');
    } catch (error) {
      console.error('❌ Errore durante il seeding:', error);
    }
  }
}
