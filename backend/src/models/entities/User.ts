import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { Customer } from "./Customer";
import { Restaurant } from "./Restaurant";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: "admin" | "customer" | "restaurant";

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.user)
  restaurant: Restaurant;
}
