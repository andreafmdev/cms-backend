import { DataSource } from 'typeorm';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { setSeederFactory } from 'typeorm-extension';

export class GroupFactory {
  private readonly predefinedGroups = [
    { name: 'Admin' },
    { name: 'Editor' },
    { name: 'Viewer' },
  ];

  constructor(private readonly dataSource: DataSource) {}

  // Metodo per creare gruppi predefiniti
  public async createDefaultGroups(): Promise<GroupOrmEntity[]> {
    const repository = this.dataSource.getRepository(GroupOrmEntity);

    // Verifica se i gruppi predefiniti già esistono
    const existingGroups = await repository.find();
    if (existingGroups.length > 0) {
      console.log('⚠️ Default groups already exist, skipping creation.');
      return existingGroups;
    }

    console.log('⚙️ Creating default groups...');
    const groups = this.predefinedGroups.map((groupData) => {
      const group = new GroupOrmEntity();
      group.name = groupData.name;
      return group;
    });

    const savedGroups = await repository.save(groups);
    console.log(`✅ ${savedGroups.length} default groups created.`);
    return savedGroups;
  }

  // Metodo per ottenere la factory standard
  public getFactory() {
    return setSeederFactory<GroupOrmEntity>(GroupOrmEntity, (fakerContext) => {
      const group = new GroupOrmEntity();
      group.name = fakerContext.company.name(); // Crea un gruppo casuale
      return group;
    });
  }
}
