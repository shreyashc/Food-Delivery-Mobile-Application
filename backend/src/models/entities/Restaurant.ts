import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { User } from ".";
import { Item } from "./Item";
import { Order } from "./Order";

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName!: string;

  @Column({ type: "text" })
  phone!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "text", nullable: true })
  imgUrl!: string;

  @Column()
  city!: string;

  @Column({ type: "decimal" })
  rating!: number;

  @Column()
  category!: string;

  @Column()
  isVeg!: boolean;

  @Column({ default: false })
  activated!: boolean;

  @OneToOne(() => User, (user) => user.restaurant, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @Column()
  userId!: number;

  @OneToMany(() => Order, (order) => order.restaurant)
  @JoinColumn()
  orders: Order[];

  /* time stamps */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
