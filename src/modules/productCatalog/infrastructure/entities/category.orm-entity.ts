import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';
/**
 * @description Category ORM entity
 * @extends BaseEntity
 * @property {number} id - The id of the category
 * @property {Audit} audit - The audit of the category
 * @property {CategoryTranslationOrmEntity[]} translations - The translations of the category
 */
@Entity('categories')
export class CategoryOrmEntity extends BaseEntity {
  @PrimaryColumn({
    comment: 'Category ID',
    type: 'uuid',
    nullable: false,
    name: 'id',
  })
  id!: string;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //#region Relations

  @OneToMany(
    () => CategoryTranslationOrmEntity,
    (translation) => translation.category,
    {
      cascade: true,
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  translations: Relation<CategoryTranslationOrmEntity>[];

  @OneToMany(
    () => ProductCategoryAttributeOrmEntity,
    (attribute) => attribute.category,
    {
      cascade: true,
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  attributes: Relation<ProductCategoryAttributeOrmEntity>[];

  //#endregion
}
