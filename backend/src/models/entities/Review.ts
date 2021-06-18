import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { Restaurant } from "./Restaurant";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal" })
  foodQuality!: number;

  @Column({ type: "decimal" })
  foodQuantity!: number;

  @Column({ type: "decimal" })
  foodDelivery!: number;

  @Column()
  description: string;

  @Column()
  customerId!: number;

  @ManyToOne(() => Customer, {
    onDelete: "CASCADE",
  })
  customer: Customer;

  /**
   * restaurant order
   */
  @Column()
  restaurantId!: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
