import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductImageId } from '../value-objects/product-image-id';
import { ImageUrl } from '../value-objects/image-url';
import { ProductImageDomainError } from '../errors/product-image-errors';

//#region INTERFACES
interface ProductImageProps {
  url: ImageUrl;
  isMain: boolean;
}

type CreateProductImageProps = {
  url: ImageUrl;
  isMain: boolean;
};

type UpdateProductImageProps = Partial<ProductImageProps>;

interface ReconstituteProps {
  id: ProductImageId;
  url: ImageUrl;
  isMain: boolean;
}
//#endregion INTERFACES

export class ProductImage extends BaseDomainEntity<ProductImageId> {
  //#region PROPERTIES
  private readonly url: ImageUrl;
  private readonly isMain: boolean;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(url: ImageUrl, isMain: boolean, id: ProductImageId) {
    super(id);
    ProductImage.validateInvariants({ url, isMain });
    this.url = url;
    this.isMain = isMain;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new product image
   * @param props - The properties of the product image
   * @param props.url - The URL of the product image
   * @param props.isMain - Whether the product image is the main image
   * @returns The new product image
   */
  static create(props: CreateProductImageProps): ProductImage {
    const id = ProductImageId.create();
    return new ProductImage(props.url, props.isMain, id);
  }

  static reconstitute(props: ReconstituteProps): ProductImage {
    return new ProductImage(props.url, props.isMain, props.id);
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(props: Partial<ProductImageProps>): void {
    if (this.isNullOrUndefined(props.url)) {
      throw ProductImageDomainError.missingUrl();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  getUrl(): ImageUrl {
    return this.url;
  }

  getIsMain(): boolean {
    return this.isMain;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(props: UpdateProductImageProps): ProductImage {
    const id = this.getId() ?? undefined;

    return new ProductImage(
      props.url ?? this.url,
      props.isMain ?? this.isMain,
      id,
    );
  }

  updateUrl(url: string): ProductImage {
    return this.update({ url: ImageUrl.create(url) });
  }

  updateIsMain(isMain: boolean): ProductImage {
    return this.update({ isMain });
  }
  //#endregion BUSINESS METHODS
}
