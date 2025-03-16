import {
  FindManyOptions,
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
import { IBaseRepository } from '@base/infrastructure/interfaces/base-repository.interface';
import { Uuid } from '@shared/value-object/uuid.vo';
import { IntId } from '@shared/value-object/numeric-id.vo';
export abstract class BaseRepository<
  OrmEntity extends ObjectLiteral,
  IdType = IntId | Uuid,
> implements IBaseRepository<OrmEntity, IdType>
{
  constructor(protected readonly repository: Repository<OrmEntity>) {}
  create(data: DeepPartial<OrmEntity>): OrmEntity {
    return this.repository.create(data);
  }

  async save(entity: OrmEntity): Promise<OrmEntity> {
    const savedEntity = await this.repository.save(entity);
    return savedEntity;
  }

  async findById(id: IdType): Promise<OrmEntity | null> {
    const idValue = this.hasToStringMethod(id) ? id.toString() : id;

    const whereFilter: FindOptionsWhere<OrmEntity> = {
      id: idValue,
    } as FindOptionsWhere<OrmEntity>;

    const result = await this.repository.findOne({ where: whereFilter });

    return result;
  }

  async findAll(options?: FindManyOptions<OrmEntity>): Promise<OrmEntity[]> {
    const ormOptions = options as unknown as FindManyOptions<OrmEntity>;
    const results = await this.repository.find(ormOptions);
    return results;
  }
  async findAllByCondition(filterCondition): Promise<OrmEntity[]> {
    const ormOptions = filterCondition as unknown as FindOneOptions<OrmEntity>;
    const results = await this.repository.find(ormOptions);

    return results;
  }
  async findOneByCondition(filterCondition): Promise<OrmEntity | null> {
    const ormOptions = filterCondition as unknown as FindOneOptions<OrmEntity>;
    const result = await this.repository.findOne(ormOptions);

    return result;
  }
  async remove(entity: OrmEntity): Promise<OrmEntity> {
    const deletedEntity = await this.repository.remove(entity);
    return deletedEntity;
  }
  async findOneByFilters<FilterType>(
    filters: FilterType,
  ): Promise<OrmEntity | null> {
    return this.repository.findOne({
      where: filters as FindOptionsWhere<OrmEntity>,
    });
  }
  async findAllByFilters<FilterType extends { page?: number; limit?: number }>(
    filters: FilterType,
  ): Promise<OrmEntity[]> {
    const { page, limit, ...whereFilters } = filters;

    const options: FindManyOptions<OrmEntity> = {
      where: whereFilters as FindOptionsWhere<OrmEntity>,
    };
    // Apply pagination only if both page and limit are provided
    if (page !== undefined && page > 0 && limit !== undefined && limit > 0) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    return this.repository.find(options);
  }
  private hasToStringMethod(id: unknown): id is { toString(): string } {
    return (
      id !== null &&
      typeof id === 'object' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof (id as any).toString === 'function'
    );
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
}
