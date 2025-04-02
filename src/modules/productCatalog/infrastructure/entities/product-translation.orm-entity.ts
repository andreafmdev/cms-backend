import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_translations')
//composite unique index
@Index(['productId', 'languageCode'], { unique: true })
export class ProductTranslationOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Product ID', type: 'uuid' })
  productId: string;

  @Column({ comment: 'Language code', type: 'varchar', length: 2 })
  languageCode: string;

  @Column({ comment: 'Product name translation', type: 'varchar', length: 100 })
  name: string;

  @Column({ comment: 'Product description tralation', type: 'text' })
  description: string;

  //#region Relations
  @ManyToOne(() => ProductOrmEntity, (product) => product.translations)
  @JoinColumn({ name: 'productId' })
  product: Relation<ProductOrmEntity>;
  //#endregion
}
