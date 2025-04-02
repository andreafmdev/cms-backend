import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { CategoryTranslationOrmEntity } from './category-translation.orm-entity';
@Entity('categories')
export class CategoryOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Category name', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Category description', type: 'text' })
  description: string;

  @Column({ comment: 'Category image URL', type: 'varchar' })
  image: string;

  //#region Relations
  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products: Relation<ProductOrmEntity>[];

  @OneToMany(
    () => CategoryTranslationOrmEntity,
    (translation) => translation.category,
  )
  translations: Relation<CategoryTranslationOrmEntity>[];
  //#endregion
}
