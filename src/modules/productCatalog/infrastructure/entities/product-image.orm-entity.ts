import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('product_images')
export class ProductImageOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Product ID', type: 'numeric' })
  productId: number;

  @Column({ comment: 'Image URL', type: 'varchar', length: 255 })
  url: string;

  @Column({ comment: 'Is main image', type: 'boolean', default: false })
  isMain: boolean;
  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @ManyToOne(() => ProductOrmEntity, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
}
