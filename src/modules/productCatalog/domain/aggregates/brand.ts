import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { BrandDomainError } from '../errors/brand-errors';
import { BrandId } from '../value-objects/brand-id';
//#region INTERFACES
/**
 * Brand properties
 */
export interface BrandProps {
  name: string;
}
/**
 * Create brand properties
 */
export type CreateBrandProps = BrandProps;
/**
 * Reconstitute brand properties
 */
export interface ReconstituteProps extends BrandProps {
  id: BrandId;
}
/**
 * Update brand properties
 */
export type UpdateBrandProps = Partial<BrandProps>;
//#endregion INTERFACES

export class Brand extends AggregateRoot<BrandId> {
  //#region PROPERTIES
  private readonly name: string;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(name: string, id: BrandId) {
    super(id);
    Brand.validateInvariants({ name });
    this.name = name;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new brand
   * @param props - The properties of the brand
   * @returns The new brand
   */
  static create(props: CreateBrandProps): Brand {
    const brandId = BrandId.create();
    return new Brand(props.name, brandId);
  }
  /**
   * Reconstitute a brand from a database entity
   * @param props - The properties of the brand
   * @returns The reconstituted brand
   */
  static reconstitute(props: ReconstituteProps): Brand {
    return new Brand(props.name, props.id);
  }
  //#endregion FACTORY METHODS

  //#region VALIDATIONS
  private static validateInvariants(props: Partial<BrandProps>): void {
    if (this.isNullOrUndefined(props.name) || props.name.trim() === '') {
      throw BrandDomainError.missingName();
    }
  }

  //#endregion VALIDATIONS

  //#region GETTERS
  /**
   * Get the name of the brand
   * @returns The name of the brand
   */
  getName(): string {
    return this.name;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(props: UpdateBrandProps): Brand {
    if (Object.keys(props).length === 0) {
      return this;
    }
    return new Brand(props.name ?? this.name, this.getId());
  }
  updateName(name: string): Brand {
    return this.update({ name });
  }
  //#endregion BUSINESS METHODS
}
