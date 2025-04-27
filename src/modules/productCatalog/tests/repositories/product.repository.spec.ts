import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '@module/productCatalog/infrastructure/repositories/product-repository';
import { ProductMapper } from '@module/productCatalog/infrastructure/mapper/product-mapper';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { TestProductBuilder } from '../utils/builder/test-product.builder';
import { Repository } from 'typeorm';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { TestProductOrmBuilder } from '../utils/builder/test-product-orm.builder';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let mockTypeOrmRepo: jest.Mocked<Repository<ProductOrmEntity>>;
  let productMapper: jest.Mocked<ProductMapper>;

  beforeEach(async () => {
    // 1. Setup del modulo di test con mock
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: ProductMapper,
          useValue: {
            toDomain: jest.fn(),
            toPersistence: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    productRepository = moduleRef.get<ProductRepository>(ProductRepository);
    mockTypeOrmRepo = moduleRef.get(getRepositoryToken(ProductOrmEntity));
    productMapper = moduleRef.get(ProductMapper);
  });

  describe('findProductById', () => {
    it('should return product when found', async () => {
      // Arrange
      const testProductOrm = TestProductOrmBuilder.create()
        .withPrice(1000)
        .build();
      const expectedDomainProduct = TestProductBuilder.create()
        .withPrice(1000)
        .build();
      testProductOrm.id = expectedDomainProduct.getId().toString();
      mockTypeOrmRepo.findOne.mockResolvedValue(testProductOrm);
      productMapper.toDomain.mockReturnValue(expectedDomainProduct);

      // Act
      const result = await productRepository.findProductById(
        expectedDomainProduct.getId(),
      );

      // Assert
      expect(result).toBe(expectedDomainProduct);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id: expectedDomainProduct.getId().toString() },
      });
      expect(productMapper.toDomain).toHaveBeenCalledWith(testProductOrm);
    });

    it('should return null when product not found', async () => {
      // Arrange
      const productId = ProductId.create();
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await productRepository.findProductById(productId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
