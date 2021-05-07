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
    foodTitle: string;
    
    // @Column()
    // foodImg: string;
  
    @Column()
    foodCategory: string;
  
    @ManyToOne(()=> Restaurant, (restaurant) => restaurant.items)
    restaurant: Restaurant;
  }
  