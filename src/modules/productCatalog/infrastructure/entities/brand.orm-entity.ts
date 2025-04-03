import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('brands')
export class BrandOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: 'Brand name', type: 'varchar', length: 100 })
  name: string;

  //#region Relations
  @OneToMany(() => ProductOrmEntity, (product) => product.brand)
  @JoinColumn({ name: 'brand_id' }) // 👈 questo collega esplicitamente la colonna FK
  products: Relation<ProductOrmEntity>[];

  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //#endregion
}
