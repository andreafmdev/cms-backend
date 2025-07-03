import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductImageId } from '../value-objects/product-image-id';
import { ImageUrl } from '../value-objects/image-url';
import { ProductImageDomainError } from '../errors/product-image-errors';

//#region INTERFACES
interface ProductImageProps {
  url: ImageUrl;
  isMain: boolean;
  name: string;
  order: number;
}

type CreateProductImageProps = {
  url: ImageUrl;
  isMain: boolean;
  name: string;
  order: number;
};

type UpdateProductImageProps = Partial<ProductImageProps>;

interface ReconstituteProps {
  id: ProductImageId;
  url: ImageUrl;
  isMain: boolean;
  name: string;
  order: number;
}
//#endregion INTERFACES

export class ProductImage extends BaseDomainEntity<ProductImageId> {
  //#region PROPERTIES
  private url: ImageUrl;
  private isMain: boolean;
  private name: string;
  private order: number;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    url: ImageUrl,
    isMain: boolean,
    id: ProductImageId,
    name?: string,
    order?: number,
  ) {
    super(id);
    ProductImage.validateInvariants({ url, isMain });
    this.url = url;
    this.isMain = isMain;
    this.name = name || '';
    this.order = order || 0;
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
  static create(
    props: CreateProductImageProps & { name?: string; order?: number },
  ): ProductImage {
    const id = ProductImageId.create();
    return new ProductImage(
      props.url,
      props.isMain,
      id,
      props.name,
      props.order,
    );
  }

  static reconstitute(props: ReconstituteProps): ProductImage {
    return new ProductImage(
      props.url,
      props.isMain,
      props.id,
      props.name,
      props.order,
    );
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

  getName(): string {
    return this.name;
  }

  getOrder(): number {
    return this.order;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(props: UpdateProductImageProps): ProductImage {
    ProductImage.validateInvariants({ url: props.url, isMain: props.isMain });
    this.url = props.url ?? this.url;
    this.isMain = props.isMain ?? this.isMain;
    return this;
  }

  updateUrl(url: string): void {
    const newUrl = ImageUrl.create(url);
    ProductImage.validateInvariants({ url: newUrl });
    this.url = newUrl;
  }

  updateIsMain(isMain: boolean): void {
    this.isMain = isMain;
  }

  setAsMain(): void {
    this.isMain = true;
  }

  // ✅ NUOVO: Metodo per rimuovere come immagine principale
  unsetAsMain(): void {
    this.isMain = false;
  }

  updateName(name: string): void {
    this.name = name;
  }

  updateOrder(order: number): void {
    this.order = order;
  }

  setOrder(order: number): void {
    this.order = order;
  }
  //#endregion BUSINESS METHODS
}
