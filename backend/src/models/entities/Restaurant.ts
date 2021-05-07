import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from ".";
import { Item } from "./Item";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName!: string;

  @Column({ type: "text" })
  phone!: string;

  @Column({ type: "text" })
  address!: string;

  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  user: User;

  @OneToMany(()=>Item, (item) => item.restaurant)
  items: Item[];

  @Column()
  userId!: number;

  /* time stamps */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
