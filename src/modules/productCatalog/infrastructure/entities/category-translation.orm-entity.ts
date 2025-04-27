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
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';

/**
 * @description Category translation ORM entity
 * @extends BaseEntity
 * @property {number} id - The id of the category translation
 * @property {number} categoryId - The id of the category
 * @property {string} languageCode - The language code of the translation
 * @property {string} name - The name of the category
 * @property {string} description - The description of the category
 */
@Entity('category_translations')
@Index(['categoryId', 'languageCode'], { unique: true })
export class CategoryTranslationOrmEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'category_id',
    comment: 'Category ID',
    type: 'uuid',
    nullable: false,
  })
  categoryId: string;

  @PrimaryColumn({
    name: 'language_code',
    comment: 'Language code',
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  languageCode: string;

  @Column({ comment: 'Category name', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Category description', type: 'text' })
  description: string;

  @ManyToOne(() => CategoryOrmEntity, (category) => category.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;

  //#region Relations

  //#endregion
}
