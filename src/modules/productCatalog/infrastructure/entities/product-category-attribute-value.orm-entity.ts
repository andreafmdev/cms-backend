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
import { ProductCategoryAttributeOrmEntity } from './product-category-attribute.orm-entity';
/**
 * @property productId - The ID of the product
 * @property attributeId - The ID of the attribute
 * @property value - The value of the attribute
 * @property audit - The audit information of the attribute value
 */
@Entity('product_attribute_values')
export class ProductCategoryAttributeValueOrmEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'product_id',
    comment: 'Product ID',
    type: 'uuid',
    nullable: false,
  })
  productId: string;

  @PrimaryColumn({
    name: 'attribute_id',
    comment: 'Attribute ID',
    type: 'uuid',
    nullable: false,
  })
  attributeId: string;

  @Column({ comment: 'Value', type: 'varchar', length: 255, nullable: true })
  value: string;

  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @ManyToOne(() => ProductOrmEntity, (product) => product.attributesValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;

  @ManyToOne(
    () => ProductCategoryAttributeOrmEntity,
    (attribute) => attribute.values,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'attribute_id' })
  attribute: Relation<ProductCategoryAttributeOrmEntity>;

  //#region Relations

  //#endregion
}
