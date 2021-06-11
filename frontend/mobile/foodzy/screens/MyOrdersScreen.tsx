import * as React from "react";
import { StyleSheet } from "react-native";
import apiClient, { setClientToken } from "../api/client";
import { View, Text } from "../components/Themed";
import { AppContext } from "../contexts/contexts";
import { RestaurantDetailsResponse } from "./RestaurantDetailsScreen";

export default function MyOrdersScreen() {
  const [orders, setOrders] = React.useState<Order[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const { appState } = React.useContext(AppContext);

  React.useEffect(() => {
    setLoading(true);
    setClientToken(appState.token);
    apiClient
      .get<Order[]>("/myorders")
      .then((res) => {
        console.log(res);
        setOrders(res.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {orders.map((order) => (
        <View key={order.id}>
          <Text>{order.restaurant.displayName}</Text>
          <Text>{order.totalAmount}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});

interface Order {
  id: number;
  customerId: number;
  deliveryAddress: string;
  orderStatus: number;
  paidToRestaurant: boolean;
  paymentStatus: number;
  restaurantId: number;
  totalAmount: number;
  restaurant: RestaurantDetailsResponse;
}
