/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  Login: undefined;
  Signup: undefined;
  MyOrders: undefined;
  OrderDetails: { orderid: number };
  Payment: { clientSecret: string; totalAmount: number; noOfItems: number };
  NotFound: undefined;
};

export type BottomTabParamList = {
  Order: undefined;
  Profile: undefined;
};

export type OrderParamList = {
  OrderScreen: undefined;
  RestaurantDetailsScreen: { restaurantId: number | string };
};

export type ProfileParamList = {
  ProfileScreen: undefined;
};
