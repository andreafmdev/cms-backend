import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('brands')
export class BrandOrmEntity extends BaseOrmEntity {
  @Column({ comment: 'Brand name', type: 'varchar', length: 100 })
  name: string;

  //#region Relations
  @OneToMany(() => ProductOrmEntity, (product) => product.brand)
  products: Relation<ProductOrmEntity>[];
  //#endregion
}
