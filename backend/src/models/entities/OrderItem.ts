import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Item } from "./Item";
import { Order } from "./Order";

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId!: number;

  @OneToOne(() => Item, { onDelete: "SET NULL" })
  item: Item;

  //in case item gets deleted
  @Column()
  itemName: string;

  @Column()
  itemDescription: string;

  //incase item price ...
  @Column()
  itemPrice: number;

  @Column({ default: 1 })
  quantity!: number;

  @Column()
  orderId!: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
  })
  order: Order;
}
