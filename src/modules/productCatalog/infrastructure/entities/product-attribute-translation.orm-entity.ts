import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity';

@Entity('product_attribute_translations')
//composite unique index
@Index(['productAttributeId', 'languageCode'], { unique: true })
export class ProductAttributeTranslationOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'product_attribute_id',
    comment: 'Product attribute ID',
    type: 'numeric',
  })
  productAttributeId: number;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({
    comment: 'Translated attribute name',
    type: 'varchar',
    length: 100,
  })
  value: string;

  //#region Relations
  @ManyToOne(() => ProductAttributeOrmEntity, (attribute) => attribute.values)
  @JoinColumn({ name: 'product_attribute_id' })
  attribute: Relation<ProductAttributeOrmEntity>;
  //#endregion
}
