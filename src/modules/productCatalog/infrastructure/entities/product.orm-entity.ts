import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { BrandOrmEntity } from './brand.orm-entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';
import { ProductTranslationOrmEntity } from './product-translation.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';
import { ProductCategoryAttributeValueOrmEntity } from './product-category-attribute-value.orm-entity';

/**
 * Product ORM entity
 * @description This entity represents a product in the database
 * @extends BaseEntity
 * @property id - The ID of the product
 * @property price - The price of the product
 * @property isAvailable - The availability of the product
 * @property categoryId - The ID of the category of the product
 * @property brandId - The ID of the brand of the product
 * @property audit - The audit information of the product
 * @property category - The category of the product
 * @property brand - The brand of the product
 * @property images - The images of the product
 * @property attributesValues - The attributes values of the product
 * @property translations - The translations of the product
 */
@Entity('products')
export class ProductOrmEntity extends BaseEntity {
  @PrimaryColumn({
    comment: 'Product ID',
    type: 'uuid',
    nullable: false,
  })
  id!: string;

  @Column({
    comment: 'Product price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: 'Is available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({
    name: 'category_id',
    comment: 'Category ID',
    type: 'uuid',
    nullable: false,
  })
  categoryId!: string;

  @Column({
    name: 'brand_id',
    comment: 'Brand ID',
    type: 'uuid',
    nullable: false,
  })
  brandId!: string;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //#region Relations
  //relations with category, brand and images
  @ManyToOne(() => CategoryOrmEntity, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;

  @ManyToOne(() => BrandOrmEntity, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Relation<BrandOrmEntity>;

  @OneToMany(() => ProductImageOrmEntity, (image) => image.product, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  images: Relation<ProductImageOrmEntity>[];

  @OneToMany(
    () => ProductCategoryAttributeValueOrmEntity,
    (attributeValue) => attributeValue.product,
    {
      cascade: true,
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  attributesValues: Relation<ProductCategoryAttributeValueOrmEntity>[];

  @OneToMany(
    () => ProductTranslationOrmEntity,
    (translation) => translation.product,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  translations: Relation<ProductTranslationOrmEntity>[];

  //#endregion
}
