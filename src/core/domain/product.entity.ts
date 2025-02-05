// src/infrastructure/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ default: 'available' })
  status: 'available' | 'out_of_stock';

  @Column({ nullable: true })
  imageUrl: string;
}
