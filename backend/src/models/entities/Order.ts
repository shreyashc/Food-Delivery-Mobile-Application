import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";
import { Restaurant } from "./Restaurant";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 0 - being prepared
   * 1 - out for delivery
   * 2 - fulfilled
   */
  @Column({ default: 0 })
  orderStatus!: 0 | 1 | 2;

  /**
   * 0 - pending
   * 1 - success
   * 2 - failed
   */
  @Column({ default: 0 })
  paymentStatus!: 0 | 1 | 2;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Column({ default: false })
  paidToRestaurant!: boolean;

  @Column()
  totalAmount!: number;

  @Column()
  deliveryAddress: string;

  @Column()
  clientSecret: string;

  /**
   * customer order
   */
  @Column()
  customerId!: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: "SET NULL",
  })
  customer: Customer;

  /**
   * restaurant order
   */
  @Column()
  restaurantId!: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: "SET NULL",
  })
  restaurant: Restaurant;
}
