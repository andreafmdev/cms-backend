import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { ProductCategoryAttributeTranslationOrmEntity } from './product-category-attribute-translation.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
/**
 * Represents a product category attribute in the database.
 * This entity defines attributes that can be assigned to products within a category.
 */
@Entity('product_attributes')
@Index('idx_product_attributes_category', ['categoryId'])
export class ProductCategoryAttributeOrmEntity extends BaseEntity {
  @PrimaryColumn({
    comment: 'Product attribute ID',
    type: 'uuid',
    nullable: false,
  })
  id!: string;

  @Column({
    name: 'category_id',
    comment: 'Category ID',
    type: 'uuid',
    nullable: false,
  })
  categoryId: string;
  //audit
  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //attribute translations
  @OneToMany(
    () => ProductCategoryAttributeTranslationOrmEntity,
    (translation) => translation.attribute,
    {
      cascade: true,
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  translations: Relation<ProductCategoryAttributeTranslationOrmEntity>[];

  //category
  @ManyToOne(() => CategoryOrmEntity, (category) => category.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;
}
