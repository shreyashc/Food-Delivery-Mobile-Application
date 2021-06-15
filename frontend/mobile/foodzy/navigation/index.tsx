/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import OrdersDetailsScreen from "../screens/OrderDetailsScreen";
import PaymentScreen from "../screens/PaymentScreen";
import SignupScreen from "../screens/SignupScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  type stateTypes = "Login" | "Root" | undefined;
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<stateTypes>("Login");
  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@app_state");
        if (jsonValue) {
          const savedAppState = JSON.parse(jsonValue);

          if (savedAppState?.isAuth) {
            setInitialState("Root");
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator savedRoute={initialState} />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<Props> = ({ savedRoute }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={savedRoute}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: "Login",
          headerStyle: {
            backgroundColor: "#ff1200",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: true,
          title: "SIGN UP",
          headerStyle: {
            backgroundColor: "#ff1200",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          headerShown: true,
          headerTitle: "My Orders",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerBackTitleVisible: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrdersDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: "Order Details",
          headerStyle: {
            backgroundColor: "#ff3c58",
          },
          headerBackTitleVisible: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          headerShown: true,
          headerTitle: "Make Payment",
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
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
};

interface Props {
  savedRoute: "Login" | "Root" | undefined;
}
