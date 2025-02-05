// src/infrastructure/repositories/base.repository.ts
import { Repository, EntityTarget, DataSource, ObjectLiteral } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  // Trova tutti gli elementi
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  // Trova un elemento per ID
  async findById(id: number): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.repository.findOne({ where: { id } as any });
  }
}
