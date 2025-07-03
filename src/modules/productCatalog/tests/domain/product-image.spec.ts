import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
describe('ProductImage', () => {
  describe('Creation', () => {
    it('should create a valid product image', () => {
      const imageUrl: ImageUrl = ImageUrl.create(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
      );
      const productImage = ProductImage.create({
        url: imageUrl,
        isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
        name: TEST_CONSTANTS.PRODUCT.IMAGES[0].NAME,
        order: TEST_CONSTANTS.PRODUCT.IMAGES[0].ORDER,
      });
      expect(productImage).toBeDefined();
      expect(productImage.getUrl()).toStrictEqual(imageUrl);
      expect(productImage.getIsMain()).toBe(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
      );
    });
  });
  describe('Update', () => {
    it('should update the url of the product image', () => {
      const imageUrl: ImageUrl = ImageUrl.create(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
      );
      const updatedImageUrl: ImageUrl = ImageUrl.create(
        TEST_CONSTANTS.PRODUCT.IMAGES[1].URL,
      );
      const productImage = ProductImage.create({
        url: imageUrl,
        isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
        name: TEST_CONSTANTS.PRODUCT.IMAGES[0].NAME,
        order: TEST_CONSTANTS.PRODUCT.IMAGES[0].ORDER,
      });
      const updatedProductImage = productImage.update({
        url: updatedImageUrl,
        isMain: TEST_CONSTANTS.PRODUCT.IMAGES[1].IS_MAIN,
      });
      expect(updatedProductImage).toBeDefined();
      expect(updatedProductImage.getUrl()).toStrictEqual(updatedImageUrl);
      expect(updatedProductImage.getIsMain()).toBe(
        TEST_CONSTANTS.PRODUCT.IMAGES[1].IS_MAIN,
      );
    });
  });
});
