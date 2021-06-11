/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  Login: undefined;
  Signup: undefined;
  MyOrders: undefined;
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
