import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { ProductImageMapper } from '@module/productCatalog/infrastructure/mapper/product-image-mapper';
import { Test } from '@nestjs/testing';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductImageId } from '@module/productCatalog/domain/value-objects/product-image-id';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
describe('ProductImageMapper', () => {
  let productImageMapper: ProductImageMapper;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProductImageMapper],
    }).compile();

    productImageMapper = moduleRef.get<ProductImageMapper>(ProductImageMapper);
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const ormEntity = new ProductImageOrmEntity();
      const id = ProductImageId.create();
      const url = TEST_CONSTANTS.PRODUCT.IMAGES[0].URL;
      const isMain = TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN;
      ormEntity.id = id.toString();
      ormEntity.url = url;
      ormEntity.isMain = isMain;

      const domainEntity = productImageMapper.toDomain(ormEntity);
      const domainId = domainEntity.getId().toString();
      expect(domainId).toBe(id.toString());
      expect(domainEntity.getUrl().toString()).toBe(url);
      expect(domainEntity.getIsMain()).toBe(isMain);
    });
  });

  describe('toPersistence', () => {
    it('should map domain entity to ORM entity', () => {
      const url = TEST_CONSTANTS.PRODUCT.IMAGES[0].URL;
      const isMain = TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN;
      const domainEntity = ProductImage.create({
        url: ImageUrl.create(url),
        isMain: isMain,
      });

      const ormEntity = productImageMapper.toPersistence(domainEntity);

      expect(ormEntity.url).toBe(url);
      expect(ormEntity.isMain).toBe(isMain);
    });
  });
  describe('bidirectional mapping', () => {
    it('should map domain entity to ORM entity and back to domain entity', () => {
      const url = TEST_CONSTANTS.PRODUCT.IMAGES[0].URL;
      const isMain = TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN;
      const domainEntity = ProductImage.create({
        url: ImageUrl.create(url),
        isMain: isMain,
      });
      const ormEntity = productImageMapper.toPersistence(domainEntity);
      const domainEntity2 = productImageMapper.toDomain(ormEntity);
      const domainId = domainEntity.getId().toString();
      const domainId2 = domainEntity2.getId().toString();
      expect(domainId).toBe(domainId2);
      expect(domainEntity2.getUrl().toString()).toBe(url);
      expect(domainEntity2.getIsMain()).toBe(isMain);
    });
  });
});
