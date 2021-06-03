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

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  displayName!: string;

  @Column({ type: "text", nullable: true })
  phone!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ type: "text", nullable: true })
  imgUrl!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ type: "decimal", nullable: true })
  rating!: number;

  @Column({ nullable: true })
  category!: string;

  @Column({ nullable: true })
  isVeg!: boolean;

  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  user: User;

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @Column()
  userId!: number;

  /* time stamps */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
