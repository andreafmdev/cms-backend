import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { CategoryTranslationOrmEntity } from './category-translation.orm-entity';
import { ProductAttributeOrmEntity } from './product-attribute.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';
@Entity('categories')
export class CategoryOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Category name', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Category description', type: 'text' })
  description: string;

  //#region Relations
  @OneToMany(() => ProductOrmEntity, (product) => product.category)
  products: Relation<ProductOrmEntity>[];

  @OneToMany(
    () => CategoryTranslationOrmEntity,
    (translation) => translation.category,
  )
  translations: Relation<CategoryTranslationOrmEntity>[];

  @Column(() => Audit, { prefix: false })
  audit: Audit;

  @OneToMany(() => ProductAttributeOrmEntity, (attribute) => attribute.category)
  attributes: Relation<ProductAttributeOrmEntity>[];
  //#endregion
}
