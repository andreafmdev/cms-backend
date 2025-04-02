import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity';

@Entity('product_attribute_translations')
export class ProductAttributeTranslationOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Product attribute ID', type: 'uuid' })
  productAttributeId: string;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({
    comment: 'Translated attribute name',
    type: 'varchar',
    length: 100,
  })
  name: string;

  //#region Relations
  @ManyToOne(() => ProductAttributeOrmEntity, (attribute) => attribute.values)
  @JoinColumn({ name: 'productAttributeId' })
  attribute: Relation<ProductAttributeOrmEntity>;
  //#endregion
}
