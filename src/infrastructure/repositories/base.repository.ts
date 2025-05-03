import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { IBaseRepository } from '@base/infrastructure/interfaces/base-repository.interface';
import { Uuid } from '@shared/value-object/uuid.vo';
import { IntId } from '@shared/value-object/numeric-id.vo';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';

export interface PaginationParams {
  page?: number;
  limit?: number;
}
export type FilterParams<OrmEntity> = FindOptionsWhere<OrmEntity> & {
  [key: string]: any;
};
/**
 * Interface for mapping between domain and ORM entities
 */
interface IMapper<DomainEntity, OrmEntity> {
  toDomain(orm: OrmEntity): DomainEntity;
  toPersistence(domain: DomainEntity): OrmEntity;
}
/**
 * Base repository class for all repositories
 */
export abstract class BaseRepository<
  DomainEntity extends BaseDomainEntity<any>,
  OrmEntity extends ObjectLiteral,
  IdType = IntId | Uuid,
> implements IBaseRepository<DomainEntity, IdType>
{
  constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: IMapper<DomainEntity, OrmEntity>,
  ) {}
  /**
   * Create a new entity
   * @param data - The data to create the entity
   * @returns The created entity
   */
  create(data: DomainEntity): DomainEntity {
    const mappedData = this.mapper.toPersistence(data);
    const orm = this.repository.create(mappedData);
    return this.mapper.toDomain(orm);
  }

  /**
   * Save an entity
   * @param entity - The entity to save
   * @returns The saved entity
   */
  async save(entity: DomainEntity): Promise<DomainEntity> {
    const orm = this.mapper.toPersistence(entity);
    const savedEntity = await this.repository.save(orm);
    return this.mapper.toDomain(savedEntity);
  }
  /**
   * Find an entity by its ID
   * @param id - The ID of the entity to find
   * @returns The entity if found, otherwise null
   */
  async findById(id: IdType): Promise<DomainEntity | null> {
    const idValue = this.hasToStringMethod(id) ? id.toString() : id;

    const orm = await this.repository.findOneBy({
      id: idValue,
    } as FindOptionsWhere<OrmEntity>);
    return orm ? this.mapper.toDomain(orm) : null;
  }
  async findAll(): Promise<DomainEntity[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map((orm) => this.mapper.toDomain(orm));
  }
  /**
   * Find an entity by a condition
   * @param condition - The condition to find the entity
   * @returns The entity if found, otherwise null
   */
  async findOneByCondition(
    condition?: FindOptionsWhere<OrmEntity>,
  ): Promise<DomainEntity | null> {
    const orm = await this.repository.findOne({
      where: condition as FindOptionsWhere<OrmEntity>,
    });
    return orm ? this.mapper.toDomain(orm) : null;
  }
  /**
   * Find all entities by a condition
   * @param condition - The condition to find the entities or filters
   * @returns The entities if found, otherwise null
   */
  async findAllByCondition(options?: {
    filters?: FindOptionsWhere<OrmEntity>;
    pagination?: PaginationParams;
  }): Promise<DomainEntity[]> {
    const where = options?.filters || {};
    const page = options?.pagination?.page;
    const limit = options?.pagination?.limit;

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
    const take = limit ? Number(limit) : undefined;

    const ormEntities = await this.repository.find({
      where,
      skip,
      take,
    });
    return ormEntities.map((orm) => this.mapper.toDomain(orm));
  }
  /**
   * Remove an entity
   * @param entity - The entity to remove
   */
  async remove(entity: DomainEntity): Promise<void> {
    const orm = this.mapper.toPersistence(entity);
    await this.repository.remove(orm);
  }
  async count<
    FilterType extends { page?: number | string; limit?: number | string },
  >(filters?: FilterType): Promise<number> {
    if (filters) {
      // Crea una copia dei filtri senza page e limit
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page, limit, ...whereFilters } = filters;

      return this.repository.count({
        where: whereFilters as FindOptionsWhere<OrmEntity>,
      });
    }
    return this.repository.count();
  }
  private hasToStringMethod(id: unknown): id is { toString(): string } {
    return (
      id !== null &&
      typeof id === 'object' &&
      'toString' in id &&
      typeof (id as { toString: unknown }).toString === 'function'
    );
  }
}
