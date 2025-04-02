import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';
import { BrandOrmEntity } from './brand.orm-entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';
import { ProductAttributeValueOrmEntity } from './product-attribute-value.orm-entity';
import { ProductTranslationOrmEntity } from './product-translation.orm-entity';

@Entity('products')
export class ProductOrmEntity extends BaseOrmEntity {
  @Column({
    comment: 'Product price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ comment: 'Is available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ comment: 'Category ID', type: 'uuid' })
  categoryId!: string;

  @Column({ comment: 'Brand ID', type: 'uuid' })
  brandId: string;

  //#region Relations
  //relations with category, brand and images
  @ManyToOne(() => CategoryOrmEntity, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' }) // 👈 questo collega esplicitamente la colonna FK
  category: Relation<CategoryOrmEntity>;

  @ManyToOne(() => BrandOrmEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brandId' }) // 👈 questo collega esplicitamente la colonna FK
  brand: Relation<BrandOrmEntity>;

  @OneToMany(() => ProductImageOrmEntity, (image) => image.product, {
    cascade: true,
  })
  images: ProductImageOrmEntity[];

  @OneToMany(() => ProductAttributeValueOrmEntity, (attr) => attr.product, {
    cascade: true,
  })
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
