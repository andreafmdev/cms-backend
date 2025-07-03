import { Injectable } from '@nestjs/common';
import { ProductImageOrmEntity } from '../entities/product-image.orm-entity';
import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
import { ProductImageId } from '@module/productCatalog/domain/value-objects/product-image-id';
@Injectable()
export class ProductImageMapper extends BaseMapper<
  ProductImage,
  ProductImageOrmEntity
> {
  constructor() {
    super();
  }
  toDomain(orm: ProductImageOrmEntity): ProductImage {
    return ProductImage.reconstitute({
      id: ProductImageId.create(orm.id),
      url: ImageUrl.create(orm.url),
      isMain: orm.isMain,
      name: orm.name,
      order: orm.order,
    });
  }

  toPersistence(domain: ProductImage): ProductImageOrmEntity {
    const orm = new ProductImageOrmEntity();
    const id = domain.getId();
    if (id) {
      orm.id = id.toString();
    }
    orm.url = domain.getUrl().getValue();
    orm.isMain = domain.getIsMain();
    orm.name = domain.getName();
    orm.order = domain.getOrder();
    return orm;
  }
}
