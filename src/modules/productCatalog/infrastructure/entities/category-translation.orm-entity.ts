import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';

@Entity('category_translations')
export class CategoryTranslationOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Category ID', type: 'numeric' })
  categoryId: number;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({ comment: 'Category name', type: 'varchar', length: 100 })
  name: string;

  //#region Relations
  @ManyToOne(() => CategoryOrmEntity, (category) => category.translations)
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;
  //#endregion
}
