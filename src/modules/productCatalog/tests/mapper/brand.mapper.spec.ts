import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandOrmEntity } from '@module/productCatalog/infrastructure/entities/brand.orm-entity';
import { BrandMapper } from '@module/productCatalog/infrastructure/mapper/brand-mapper';
import { Test } from '@nestjs/testing';
import { TestBrandBuilder } from '../utils/builder/test-brand.builder';

describe('BrandMapper', () => {
  let brandMapper: BrandMapper;
  let testBrandBuilder: TestBrandBuilder;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BrandMapper],
    }).compile();
    testBrandBuilder = TestBrandBuilder.create();
    brandMapper = moduleRef.get<BrandMapper>(BrandMapper);
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const ormEntity = new BrandOrmEntity();
      ormEntity.id = testBrandBuilder.build().getId().toString();
      ormEntity.name = testBrandBuilder.build().getName();

      const domainEntity = brandMapper.toDomain(ormEntity);
      const domainId = domainEntity.getId();
      expect(domainId.toString()).toBe(
        testBrandBuilder.build().getId()?.toString(),
      );
      expect(domainEntity.getName()).toBe(testBrandBuilder.build().getName());
    });
  });

  describe('toPersistence', () => {
    it('should map domain entity to ORM entity', () => {
      const brand: Brand = testBrandBuilder.build();

      const ormEntity = brandMapper.toPersistence(brand);

      expect(ormEntity.name).toBe(testBrandBuilder.build().getName());
    });
  });
});
