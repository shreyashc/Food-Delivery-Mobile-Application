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
              ReviewsScreen: "reviews",
              AddReviewScreen: "add_review",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "profile",
              EditProfileScreen: "edit-profile",
            },
          },
        },
      },
      MyOrders: "myOrders",
      OrderDetails: "orderdetails",
      Payment: "payment",
      Login: "Login",
      Signup: "Signup",
      NotFound: "*",
    },
  },
};
