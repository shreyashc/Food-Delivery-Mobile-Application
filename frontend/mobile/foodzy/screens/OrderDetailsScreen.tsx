import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import apiClient, { setClientToken } from "../api/client";
import { View, Text } from "../components/Themed";
import { orderStatus, orderStatusColors } from "../constants/Status";
import { AppContext } from "../contexts/contexts";
import { RootStackParamList } from "../types";
import { RestaurantDetailsResponse } from "./RestaurantDetailsScreen";

export default function OrdersDetailsScreen() {
  //route
  const route = useRoute<RouteProp<RootStackParamList, "OrderDetails">>();
  const orderId = route.params.orderid;

  //state
  const [order, setOrder] = React.useState<Order>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  //context
  const { appState } = React.useContext(AppContext);

  const fetchMyOrders = () => {
    setClientToken(appState.token);
    console.log("fetching");

    apiClient
      .get<Order>(`/orderdetails/${orderId}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!loading && error && (
        <View style={styles.info}>
          <Text style={{ textAlign: "center", fontSize: 16, color: "#fb3877" }}>
            Oops Something Went Wrong!
          </Text>
        </View>
      )}

      {loading && !error && (
        <View style={styles.info}>
          <ActivityIndicator
            style={{ marginTop: 20, marginBottom: 8 }}
            size="large"
            color="#fd3d3d"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  wrapper: {
    padding: 10,
    flex: 1,
  },
  resDetails: {
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    marginLeft: 5,
  },

  itemInfoContainer: {
    flex: 3,
  },
  itemDet: {
    marginTop: 8,
    color: "#777777",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  itemTitle: {
    fontSize: 20,
    fontWeight: "500",
  },

  itemPrice: {
    fontSize: 19,
    padding: 2,
    fontWeight: "500",
  },
  itemDes: {
    fontSize: 14,
    color: "#716e6e",
    padding: 2,
  },

  cartItem: {
    display: "flex",
    flexDirection: "row",

    padding: 13,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,

    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    borderRadius: 15,
  },
});

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
  createdAt: string;
}

interface OrderItem {
  id: number;
  itemId: number;
  orderId: number;
  quantity: number;
}
