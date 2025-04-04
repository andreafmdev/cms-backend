import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { CategoryId } from '../value-objects/category-id';

export class Category extends BaseDomainEntity<CategoryId> {
  private name: string;
  private description: string;
  private image: string;
  private constructor(
    name: string,
    description: string,
    image: string,
    id?: CategoryId,
  ) {
    super(id ?? null);
    this.name = name;
    this.description = description;
    this.image = image;
  }
  /**
   * Create a new category
   * @param props - The properties of the category
   * @returns The created category
   */
  static create(props: {
    name: string;
    description: string;
    image: string;
  }): Category {
    const category = new Category(props.name, props.description, props.image);
    return category;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getImage(): string {
    return this.image;
  }
  /**
   * Reconstitute a category from its id, name, description and image
   * @param id - The id of the category
   * @param name - The name of the category
   * @param description - The description of the category
   * @param image - The image of the category
   * @returns The reconstituted category
   */
  static reconstitute(props: {
    id: number;
    name: string;
    description: string;
    image: string;
  }): Category {
    const category = new Category(
      props.name,
      props.description,
      props.image,
      CategoryId.create(props.id),
    );
    return category;
  }
}
