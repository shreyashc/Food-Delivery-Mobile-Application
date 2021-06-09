import { Request, Response } from "express";
import { Restaurant, User } from "../models/entities";

const allRestaurants = async (_req: Request, res: Response) => {
  const restaurant = await Restaurant.find();
  if (!restaurant) {
    return res.send("Not Found!");
  }
  return res.render("admin.pug", {
    restaurants: restaurant,
  });
};

const deleteRestaurant = async (_req: Request, res: Response) => {
    try{
        const userId = parseInt(_req.params.id)
        const user = await User.findOne( userId );
        if(!user){
            return res.send("Something Went Wrong")
        }
        
        await User.delete({
            id : user.id
        })
        return res.redirect("/auth/admin.pug")
    }catch (err){
        res.send("err")
    }

}

export { allRestaurants , deleteRestaurant };
