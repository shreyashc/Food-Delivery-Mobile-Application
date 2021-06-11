/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Order: {
            screens: {
              OrderScreen: "order",
              RestaurantDetailsScreen: "restaurant_details",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "profile",
            },
          },
        },
      },
      MyOrders: "myOrders",
      Login: "Login",
      Signup: "Signup",
      NotFound: "*",
    },
  },
};
