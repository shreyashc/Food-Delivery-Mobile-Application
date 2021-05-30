/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import LoginScreen from "../screens/LoginScreen";
import { useContext } from "react";
import { AppContext } from "../Providers/contexts";
import SignupScreen from "../screens/SignupScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { appState } = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={true || appState.isAuth ? "Root" : "Login"}
    >
      {/* {
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={appState.isAuth? "Root" : "Login"}>
        appState.isAuth 
        ?
          <Stack.Screen name="Root" component={BottomTabNavigator} />
        :
          <Stack.Screen name="Login" component={LoginScreen}/>
      } */}

      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
