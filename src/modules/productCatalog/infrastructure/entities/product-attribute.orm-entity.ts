import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductAttributeValueOrmEntity } from './product-attribute-value.orm-entity';
import { ProductAttributeTranslationOrmEntity } from './product-attribute-translation.orm-entity';
import { CategoryOrmEntity } from './category.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('product_attributes')
export class ProductAttributeOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Category ID', type: 'numeric' })
  categoryId: number;

  @Column({ comment: 'Attribute name', type: 'varchar', length: 100 })
  name: string;
  //possible value for the attribute

  @OneToMany(() => ProductAttributeValueOrmEntity, (attr) => attr.attribute, {
    cascade: true,
  })
  values: ProductAttributeValueOrmEntity[];

  //attribute translations
  @OneToMany(
    () => ProductAttributeTranslationOrmEntity,
    (translation) => translation.attribute,
    {
      cascade: true,
    },
  )
  translations: ProductAttributeTranslationOrmEntity[];
  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //category
  @ManyToOne(() => CategoryOrmEntity, (category) => category.attributes)
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;
}
