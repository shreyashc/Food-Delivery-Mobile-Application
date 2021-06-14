import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import apiClient, { setClientToken } from "../api/client";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { Text, View } from "../components/Themed";
import {
  orderStatus,
  orderStatusColors,
  paymentStatus,
  paymentStatusColors,
} from "../constants/Status";
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

  const fetchMyOrder = () => {
    setClientToken(appState.token);

    apiClient
      .get<Order>(`/orderdetails/${orderId}`)
      .then((res) => {
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
    fetchMyOrder();
  }, []);

  const Header = ({ order }: HeaderProp) => (
    <View style={styles.itemInfoContainer}>
      <Text style={styles.title}>{order.restaurant.displayName}</Text>
      <Text style={styles.itemDet}>{order.restaurant.address}</Text>
      <View>
        <View>
          <Text style={{ ...styles.itemPrice, marginVertical: 5 }}>
            Total Amount:{" "}
            <Text style={{ color: "coral" }}>{"₹" + order.totalAmount}</Text>
          </Text>
          <View style={{ marginVertical: 5 }}>
            <Text style={styles.statusText}>
              <Ionicons
                name="swap-horizontal-outline"
                color={paymentStatusColors[order.paymentStatus]}
                size={18}
              />{" "}
              {paymentStatus[order.paymentStatus]}
            </Text>
            {order.paymentStatus !== 0 && (
              <Text style={styles.statusText}>
                <Ionicons
                  name="fast-food-outline"
                  color={orderStatusColors[order.orderStatus]}
                  size={18}
                />{" "}
                {orderStatus[order.orderStatus]}
              </Text>
            )}
            <Text style={styles.statusText}>
              <Ionicons name="earth-outline" color="#777777" size={18} />{" "}
              Delivering to <Text>{order.deliveryAddress}</Text>
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{ ...styles.itemPrice, textAlign: "center", marginVertical: 8 }}
      >
        Ordered Items
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {!loading && error && <Error />}

      {loading && !error && <Spinner />}

      {!error && order && (
        <View>
          <View>
            <FlatList
              data={order.items}
              keyExtractor={(item) => item.id.toString()}
              style={styles.listContainer}
              ListHeaderComponent={<Header order={order} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchMyOrder}
                />
              }
              ListFooterComponent={<View style={{ height: 50 }} />}
              renderItem={({ item }) => (
                <View key={item.id.toString()} style={styles.cartItem}>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                      {item.itemName}
                    </Text>
                    <Text>{item.itemDescription}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "300" }}>
                      {"₹" + item.itemPrice}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
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
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  resDetails: {
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
  },

  itemInfoContainer: {
    padding: 2,
    marginBottom: 10,
    marginTop: 10,
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

  statusText: {
    fontSize: 16,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
    borderRadius: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
  },
  header: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  backButton: {
    height: 84,
    width: 84,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
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
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  itemId: number;
  orderId: number;
  quantity: number;
  itemName: string;
  itemPrice: number;
  itemDescription: string;
}

interface HeaderProp {
  order: Order;
}
