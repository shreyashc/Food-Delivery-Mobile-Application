import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import apiClient, { setClientToken } from "../api/client";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { Text, View } from "../components/Themed";
import { paymentStatus, paymentStatusColors } from "../constants/Status";
import { AppContext } from "../contexts/contexts";
import { RootStackParamList } from "../types";
import { getFormattedDate } from "../utils/dateUtils";
import { RestaurantDetailsResponse } from "./RestaurantDetailsScreen";

export default function MyOrdersScreen() {
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList, "OrderDetails">
  >();

  //state
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  //context
  const { appState } = React.useContext(AppContext);

  const fetchMyOrders = () => {
    setClientToken(appState.token);

    apiClient
      .get<Order[]>("/myorders")
      .then((res) => {
        setOrders(res.data);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!loading && error && <Error />}

      {loading && !error && <Spinner />}

      {!error && !loading && (
        <FlatList
          data={orders}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchMyOrders();
              }}
            />
          }
          style={{ padding: 10, marginTop: 5 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.push("OrderDetails", { orderid: item.id });
              }}
            >
              <View style={styles.cartItem}>
                <View style={styles.itemInfoContainer}>
                  <Text style={styles.itemTitle}>
                    {item.restaurant.displayName}
                  </Text>
                  <View style={{}}>
                    <Text style={styles.itemDes}>
                      <Ionicons
                        name="swap-horizontal-outline"
                        color={paymentStatusColors[item.paymentStatus]}
                        size={18}
                      />{" "}
                      {paymentStatus[item.paymentStatus]}
                    </Text>
                    <Text style={styles.itemPrice}> ₹ {item.totalAmount}</Text>
                    <Text style={styles.itemDet}>
                      On {getFormattedDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
                <Image
                  style={styles.itemImage}
                  source={
                    item.restaurant.imgUrl
                      ? { uri: item.restaurant.imgUrl }
                      : require("../assets/images/restaurant-wall.jpg")
                  }
                />
              </View>
            </TouchableOpacity>
          )}
        />
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

    borderRadius: 12,

    ...Platform.select({
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: "#ccc",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
      },
    }),
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
