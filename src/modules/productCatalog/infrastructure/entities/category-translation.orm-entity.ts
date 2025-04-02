import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';

@Entity('category_translations')
export class CategoryTranslationOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Category ID', type: 'uuid' })
  categoryId: string;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({ comment: 'Category name', type: 'varchar', length: 100 })
  name: string;

  //#region Relations
  @ManyToOne(() => CategoryOrmEntity, (category) => category.translations)
  @JoinColumn({ name: 'categoryId' })
  category: Relation<CategoryOrmEntity>;
  //#endregion
}
