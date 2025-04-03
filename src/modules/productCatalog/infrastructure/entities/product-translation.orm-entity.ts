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
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_translations')
//composite unique index
@Index(['productId', 'languageCode'], { unique: true })
export class ProductTranslationOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Product ID', type: 'numeric' })
  productId: number;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({ comment: 'Product name translation', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Product description tralation', type: 'text' })
  description: string;

  //#region Relations
  @ManyToOne(() => ProductOrmEntity, (product) => product.translations)
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;
  //#endregion
}
