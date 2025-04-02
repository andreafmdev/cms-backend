import { ProductTranslationId } from '../value-objects/product-translation-id';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
interface ProductTranslationProps {
  languageCode: string;
  name: string;
  description: string;
}

export class ProductTranslation extends BaseDomainEntity<ProductTranslationId> {
  private languageCode: string;
  private name: string;
  private description: string;
  constructor(id: ProductTranslationId, props: ProductTranslationProps) {
    super(id);
    this.languageCode = props.languageCode;
    this.name = props.name;
    this.description = props.description;
  }
  //#region BUSINESS LOGIC
  // ✅ Factory method
  static create(props: ProductTranslationProps): ProductTranslation {
    const id = ProductTranslationId.create(); // genera UUID se non passato
    return new ProductTranslation(id, props);
  }
  //#endregion
  //#region GETTERS
  getLanguageCode(): string {
    return this.languageCode;
  }
  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return this.description;
  }
  //#endregion

  //#endregion
  //#region RECONSITUTE
  static reconstitute(
    id: ProductTranslationId,
    props: ProductTranslationProps,
  ): ProductTranslation {
    return new ProductTranslation(id, props);
  }
  //#endregion
}
