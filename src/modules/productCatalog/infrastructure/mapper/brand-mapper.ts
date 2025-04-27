import { Injectable } from '@nestjs/common';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandOrmEntity } from '../entities/brand.orm-entity';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
@Injectable()
export class BrandMapper extends BaseMapper<Brand, BrandOrmEntity> {
  //#region TO DOMAIN
  toDomain(orm: BrandOrmEntity): Brand {
    return Brand.reconstitute({
      id: BrandId.create(orm.id),
      name: orm.name,
    });
  }
  //#endregion

  //#region TO PERSISTENCE
  toPersistence(domainEntity: Brand): BrandOrmEntity {
    const orm = new BrandOrmEntity();
    const id = domainEntity.getId();
    if (id) {
      orm.id = id.toString();
    }
    orm.name = domainEntity.getName();
    return orm;
  }
  //#endregion
}
