import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductAttributeValueOrmEntity } from './product-attribute-value.orm-entity';

@Entity('product_attributes')
export class ProductAttributeOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Category ID', type: 'uuid' })
  categoryId: string;

  @Column({ comment: 'Attribute name', type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => ProductAttributeValueOrmEntity, (attr) => attr.product, {
    cascade: true,
  })
  values: ProductAttributeValueOrmEntity[];
}
