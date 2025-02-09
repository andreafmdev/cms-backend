import { DataSource, Repository } from 'typeorm';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';

export class PermissionFactory {
  private repository: Repository<PermissionOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PermissionOrmEntity);
  }

  // Static list of default permissions
  private static readonly defaultPermissions: Partial<PermissionOrmEntity>[] = [
    { name: 'READ' },
    { name: 'WRITE' },
    { name: 'DELETE' },
  ];

  // Method to create default permissions
  public async createDefaultPermissions(): Promise<PermissionOrmEntity[]> {
    console.log('⚙️ Checking for existing permissions...');
    const existingPermissions = await this.repository.find();

    if (existingPermissions.length > 0) {
      console.log('✅ Default permissions already exist, skipping creation.');
      return existingPermissions;
    }

    console.log('⚙️ Creating default permissions...');
    const permissions = PermissionFactory.defaultPermissions.map((data) =>
      this.repository.create(data),
    );

    const savedPermissions = await this.repository.save(permissions);
    console.log('✅ Default permissions created:', savedPermissions);
    return savedPermissions;
  }
}
