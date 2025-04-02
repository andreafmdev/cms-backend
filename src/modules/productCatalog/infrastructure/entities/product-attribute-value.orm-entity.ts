import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity';

@Entity('product_attribute_values')
export class ProductAttributeValueOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Product ID', type: 'uuid' })
  productId: string;

  @Column({ comment: 'Attribute ID', type: 'uuid' })
  attributeId: string;

  @Column({ comment: 'Value', type: 'varchar', length: 255 })
  value: string;

  //#region Relations
  @ManyToOne(() => ProductOrmEntity, (product) => product.attributes)
  @JoinColumn({ name: 'productId' })
  product: Relation<ProductOrmEntity>;

  @ManyToOne(() => ProductAttributeOrmEntity, (attribute) => attribute.values)
  @JoinColumn({ name: 'attributeId' })
  attribute: Relation<ProductAttributeOrmEntity>;
  //#endregion
}
