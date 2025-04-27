import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_images')
export class ProductImageOrmEntity extends BaseEntity {
  @PrimaryColumn({
    comment: 'Product image ID',
    type: 'uuid',
    nullable: false,
  })
  id!: string;

  @Column({ comment: 'Product ID', type: 'uuid', nullable: false })
  productId: string;

  @Column({ comment: 'Image order', type: 'numeric', nullable: true })
  order: number;

  @Column({
    comment: 'Image name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    comment: 'Image URL',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  url: string;

  @Column({ comment: 'Is main image', type: 'boolean', default: false })
  isMain: boolean;

  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @ManyToOne(() => ProductOrmEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
}
