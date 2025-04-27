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
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_translations')
//composite unique index
@Index(['productId', 'languageCode'], { unique: true })
export class ProductTranslationOrmEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'product_id',
    comment: 'Product ID',
    type: 'uuid',
    nullable: false,
  })
  productId: string;

  @PrimaryColumn({
    name: 'language_code',
    comment: 'Language code',
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  languageCode: string;

  @Column({ comment: 'Product name translation', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Product description tralation', type: 'text' })
  description: string;

  @ManyToOne(() => ProductOrmEntity, (product) => product.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
  //#region Relations

  //#endregion
}
