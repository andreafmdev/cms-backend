import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';
import { BrandOrmEntity } from './brand.orm-entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';
import { ProductTranslationOrmEntity } from './product-translation.orm-entity';
import { ProductAttributeValueOrmEntity } from './product-attribute-value.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('products')
export class ProductOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    comment: 'Product price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ comment: 'Is available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({
    name: 'category_id',
    comment: 'Category ID',
    type: 'numeric',
    nullable: false,
  })
  categoryId!: number;

  @Column({ name: 'brand_id', comment: 'Brand ID', type: 'numeric' })
  brandId: number;

  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //#region Relations
  //relations with category, brand and images
  @ManyToOne(() => CategoryOrmEntity, (category) => category.products, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT', // 👈 questo collega esplicitamente la colonna FK
  })
  @JoinColumn({ name: 'category_id' }) // 👈 questo collega esplicitamente la colonna FK
  category: Relation<CategoryOrmEntity>;

  @ManyToOne(() => BrandOrmEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' }) // 👈 questo collega esplicitamente la colonna FK
  brand: Relation<BrandOrmEntity>;

  @OneToMany(() => ProductImageOrmEntity, (image) => image.product)
  images: ProductImageOrmEntity[];

  @OneToMany(
    () => ProductAttributeValueOrmEntity,
    (attribute) => attribute.product,
    {
      eager: true,
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  attributes: ProductAttributeValueOrmEntity[];

  @OneToMany(
    () => ProductTranslationOrmEntity,
    (translation) => translation.product,
    {
      cascade: true,
    },
  )
  translations: ProductTranslationOrmEntity[];

  //#endregion
}
