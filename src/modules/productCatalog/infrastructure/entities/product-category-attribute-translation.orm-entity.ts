import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { ProductCategoryAttributeOrmEntity } from './product-category-attribute.orm-entity';
@Entity('product_category_attribute_translations')
@Index(['attributeId', 'languageCode'], { unique: true })
/**
 * @description This entity is used to store the translations of the attributes of the product categories
 * @attention This index is used to ensure that each attribute has only one translation per language
 * @attributeId is the ID of the attribute
 * @languageCode is the language code of the translation
 * @value is the translated value of the attribute
 */
export class ProductCategoryAttributeTranslationOrmEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'attribute_id',
    comment: 'Category attribute ID',
    type: 'uuid',
    nullable: false,
  })
  attributeId: string;

  @PrimaryColumn({
    comment: 'Language code',
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  languageCode: string;

  @Column({
    comment: 'Translated value',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  value: string;

  @ManyToOne(
    () => ProductCategoryAttributeOrmEntity,
    (attribute) => attribute.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'attribute_id' })
  attribute: Relation<ProductCategoryAttributeOrmEntity>;

  //#region Relations

  //#endregion
}
