import { Uuid } from '@shared/value-object/uuid.vo';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface IBaseRepository<T> {
  create?(data: DeepPartial<T>): T;
  createMany?(data: DeepPartial<T>[]): T[];
  save?(data: DeepPartial<T>): Promise<T>;
  saveMany?(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById?(id: Uuid): Promise<T>;
  findByCondition?(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll?(options?: FindManyOptions<T>): Promise<T[]>;
  findWithRelations?(relations: FindManyOptions<T>): Promise<T[]>;
  preload?(entityLike: DeepPartial<T>): Promise<T>;
  remove?(data: T): Promise<T>;
}
