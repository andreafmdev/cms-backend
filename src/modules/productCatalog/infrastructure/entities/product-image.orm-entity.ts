import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_images')
export class ProductImageOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Product ID', type: 'uuid' })
  productId: string;

  @Column({ comment: 'Image URL', type: 'varchar', length: 255 })
  url: string;

  @Column({ comment: 'Is main image', type: 'boolean', default: false })
  isMain: boolean;

  @ManyToOne(() => ProductOrmEntity, (product) => product.images)
  @JoinColumn({ name: 'productId' })
  product: Relation<ProductOrmEntity>;
}
