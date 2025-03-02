import { Uuid } from '@shared/value-object/uuid.vo';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface IBaseRepository<T, IdType = string | number | Uuid> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findById(id: IdType): Promise<T | null>;
  findAllByCondition(filterCondition: FindManyOptions<T[]>): Promise<T[]>;
  findOneByCondition(filterCondition: FindOneOptions<T[]>): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  remove(data: T): Promise<T>;
}
