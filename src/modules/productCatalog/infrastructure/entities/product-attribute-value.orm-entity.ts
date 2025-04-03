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
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('product_attribute_values')
export class ProductAttributeValueOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Product ID', type: 'numeric' })
  productId: number;

  @Column({ comment: 'Attribute ID', type: 'numeric' })
  attributeId: number;

  @Column({ comment: 'Value', type: 'varchar', length: 255 })
  value: string;

  //#region Relations
  @ManyToOne(() => ProductOrmEntity, (product) => product.attributes)
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @ManyToOne(() => ProductAttributeOrmEntity, (attribute) => attribute.values)
  @JoinColumn({ name: 'attribute_id' })
  attribute: Relation<ProductAttributeOrmEntity>;
  //#endregion
}
