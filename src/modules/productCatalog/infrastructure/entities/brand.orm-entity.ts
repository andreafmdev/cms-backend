import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { Audit } from '@base/infrastructure/entities/util/audit.composition';

@Entity('brands')
export class BrandOrmEntity extends BaseEntity {
  @PrimaryColumn({
    comment: 'Brand ID',
    type: 'uuid',
    nullable: false,
  })
  id!: string;

  @Column({
    comment: 'Brand name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  //#region Relations

  @Column(() => Audit, { prefix: false })
  audit: Audit;
  //#endregion
}
