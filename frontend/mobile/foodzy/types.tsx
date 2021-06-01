/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  Login: undefined;
  Signup: undefined;
};

export type BottomTabParamList = {
  Order: undefined;
  Profile: undefined;
};

export type OrderParamList = {
  OrderScreen: undefined;
  RestaurantDetailsScreen: { reastaurantId: number | string };
};

export type TabTwoParamList = {
  ProfileScreen: undefined;
};
