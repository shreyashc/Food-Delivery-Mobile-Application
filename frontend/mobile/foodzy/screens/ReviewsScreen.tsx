import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, Platform, RefreshControl, StyleSheet } from "react-native";
import { FAB, Rating } from "react-native-elements";
import apiClient, { setClientToken } from "../api/client";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { Text, View } from "../components/Themed";
import { AppContext } from "../contexts/contexts";
import { OrderParamList } from "../types";
import { getFormattedDate } from "../utils/dateUtils";

export default function ReviewsScreen() {
  const route = useRoute<RouteProp<OrderParamList, "Reviews">>();
  const restaurantId = route.params.restaurantId;
  const navigation = useNavigation<StackNavigationProp<OrderParamList>>();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [canAddReview, setCanAddReview] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const { appState } = React.useContext(AppContext);

  const getReviews = () => {
    apiClient
      .get<Review[]>("/restaurant_reviews/" + restaurantId)
      .then((res) => {
        setError(false);
        setReviews(res.data);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const canIpost = () => {
    setClientToken(appState.token);
    apiClient
      .get<any>("/can_i_review/?restaurantId=" + restaurantId)
      .then((res) => {
        setCanAddReview(res.data.canIReview);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    setLoading(true);
    getReviews();
    canIpost();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getReviews();
      canIpost();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {!loading && error && <Error />}

      {loading && !error && <Spinner />}

      {!error && !loading && (
        <FlatList
          data={reviews}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getReviews();
                canIpost();
              }}
            />
          }
          style={{ padding: 10, marginTop: 5 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemTitle}>
                  {item.customer.displayName}
                </Text>
                <View>
                  <View style={{ alignItems: "flex-start" }}>
                    <Rating
                      type="heart"
                      ratingCount={5}
                      readonly={true}
                      startingValue={
                        (parseFloat(item.foodDelivery) +
                          parseFloat(item.foodQuality) +
                          parseFloat(item.foodQuantity)) /
                        3
                      }
                      imageSize={20}
                      minValue={1}
                      style={{ paddingVertical: 5 }}
                    />
                  </View>
                  <Text style={styles.itemDes}>{item.description}</Text>
                  <Text style={styles.itemDet}>
                    On {getFormattedDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
      {canAddReview && (
        <FAB
          icon={<Ionicons name="add-outline" size={25} color="white" />}
          style={styles.fab}
          color="#ff3c58"
          onPress={() => {
            navigation.navigate("AddReview", { restaurantId });
          }}
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

  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
    height: 70,
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
    fontSize: 17,
    color: "#333",
    padding: 2,
  },

  cartItem: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    padding: 13,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,

    ...Platform.select({
      android: {
        elevation: 5,
      },
      default: {
        shadowColor: "#ccc",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        borderRadius: 15,
      },
    }),
  },
});
interface Review {
  id: number;
  foodQuality: string;
  foodQuantity: string;
  foodDelivery: string;
  description: string;
  customerId: number;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}

interface Customer {
  displayName: string;
  address: string;
  phone: string;
}
