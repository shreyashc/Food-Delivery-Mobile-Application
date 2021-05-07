import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isVeg: boolean;

  @Column()
  imgUrl: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  restaurantId!: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  restaurant: Restaurant;
}
