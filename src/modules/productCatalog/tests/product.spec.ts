// product.spec.ts
import { Product } from '../domain/aggregates/product';
import { ProductTranslation } from '../domain/entities/product-translation';
import { Brand } from '../domain/entities/brand';

describe('Product Domain Entity', () => {
  // Test Factories per dati di test
  const createTestTranslation = () =>
    ProductTranslation.create({
      languageCode: 'it',
      name: 'Pianoforte Test',
      description: 'Descrizione test',
    });

  const createTestBrand = () =>
    Brand.create({
      name: 'Yamaha',
    });

  describe('create', () => {
    it('should create a valid product', () => {
      // Arrange
      const translations = [createTestTranslation()];
      const brand = createTestBrand();

      // Act
      const product = Product.create({
        translations,
        price: 1000,
        isAvailable: true,
        image: 'test.jpg',
        brand,
      });

      // Assert
      expect(product).toBeDefined();
      expect(product.getPrice()).toBe(1000);
      expect(product.getTranslation('it').getName()).toBe('Pianoforte Test');
    });

    it('should throw error when price is negative', () => {
      // Arrange
      const translations = [createTestTranslation()];

      // Act & Assert
      expect(() => {
        Product.create({
          translations,
          price: -100,
          isAvailable: true,
          image: 'test.jpg',
        });
      }).toThrow('Il prezzo deve essere maggiore di zero.');
    });

    it('should throw error when no translations provided', () => {
      // Act & Assert
      expect(() => {
        Product.create({
          translations: [],
          price: 1000,
          isAvailable: true,
          image: 'test.jpg',
        });
      }).toThrow('Il prodotto deve avere almeno una traduzione.');
    });
  });
});
