/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AddReviewScreen from "../screens/AddReviewScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RestaurantDetailsScreen from "../screens/RestaurantDetailsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import { BottomTabParamList, OrderParamList, ProfileParamList } from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Order"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Order"
        component={OrderNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="fast-food-sharp" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const OrderStack = createStackNavigator<OrderParamList>();

function OrderNavigator() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <OrderStack.Screen
        name="RestaurantDetailsScreen"
        component={RestaurantDetailsScreen}
        initialParams={{ restaurantId: 0 }}
        options={{ headerShown: false }}
      />
      <OrderStack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{
          headerShown: true,
          headerTitle: "Reviews",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <OrderStack.Screen
        name="AddReview"
        component={AddReviewScreen}
        options={{
          headerShown: true,
          headerTitle: "Add Review",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </OrderStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: "Profile",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitle: "Edit Profile",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </ProfileStack.Navigator>
  );
}
