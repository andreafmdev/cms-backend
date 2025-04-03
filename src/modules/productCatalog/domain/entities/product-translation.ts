import { ProductTranslationId } from '../value-objects/product-translation-id';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';

export class ProductTranslation extends BaseDomainEntity<ProductTranslationId> {
  private languageCode: string;
  private name: string;
  private description: string;
  constructor(
    languageCode: string,
    name: string,
    description: string,
    id?: ProductTranslationId,
  ) {
    super(id ?? null);
    this.languageCode = languageCode;
    this.name = name;
    this.description = description;
  }
  //#region BUSINESS LOGIC
  // ✅ Factory method
  static create(props: {
    languageCode: string;
    name: string;
    description: string;
  }): ProductTranslation {
    //!CHECK IF PROPS ARE NOT NULL OR INVALID

    return new ProductTranslation(
      props.languageCode,
      props.name,
      props.description,
    );
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
  static reconstitute(props: {
    id: number;
    languageCode: string;
    name: string;
    description: string;
  }): ProductTranslation {
    return new ProductTranslation(
      props.languageCode,
      props.name,
      props.description,
      ProductTranslationId.create(props.id),
    );
  }
  //#endregion
}
