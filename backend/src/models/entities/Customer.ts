import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from ".";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName!: string;

  @Column({ type: "text" })
  phone!: string;

  @Column({ type: "text" })
  address!: string;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn()
  user: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
