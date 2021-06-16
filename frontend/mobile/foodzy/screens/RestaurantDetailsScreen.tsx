import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import apiClient, { setClientToken } from "../api/client";
import Cart from "../components/Cart";
import Error from "../components/Error";
import FloatingCartIndicator from "../components/FloatingCartIndicator";
import MenuItem from "../components/MenuItem";
import Spinner from "../components/Spinner";
import { Text, View } from "../components/Themed";
import { AppContext } from "../contexts/contexts";
import { Item, OrderParamList, RootStackParamList } from "../types";

export default function RestaurantDetailsScreen() {
  //route
  const route = useRoute<
    RouteProp<OrderParamList, "RestaurantDetailsScreen">
  >();
  const restaurantId = route.params.restaurantId;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // user context
  const { appState } = React.useContext(AppContext);

  //state
  const [cart, setCart] = React.useState<Item[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [resDet, setResDet] = React.useState<RestaurantDetailsResponse>();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [orderLoading, setOrderLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    apiClient
      .get<RestaurantDetailsResponse>(
        "/restautant_details_and_dishes/" + restaurantId
      )
      .then((res) => {
        setError(false);
        setResDet(res.data);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * close cart if no items present
   */
  React.useEffect(() => {
    if (cart.length < 1) {
      setIsCartOpen(false);
    }
  }, [cart]);

  const removeFromCart = (id: any) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  //total in cart
  const getTotal = () => {
    return cart.reduce((prev, curr) => prev + curr.price, 0);
  };

  const orderItems = () => {
    setClientToken(appState.token);
    const itemIds = cart.map((item) => item.id);
    const address = appState.user.customer.address;
    setOrderLoading(true);
    apiClient
      .post("/order", {
        restaurantId,
        items: itemIds,
        deliveryAddress: address,
      })
      .then((res) => {
        setOrderLoading(false);
        setIsCartOpen(false);
        console.log(res);
        let noOfItems = cart.length;
        let totalAmount = getTotal();
        navigation.navigate("Payment", {
          clientSecret: res.data.clientSecret,
          totalAmount,
          noOfItems,
        });
      })
      .catch((err) => {
        setOrderLoading(false);
        console.log(err);
      });
  };

  const Header = ({ resDet }: HeaderProp) => (
    <>
      <View style={styles.resDetails}>
        <Text style={styles.title}>{resDet?.displayName}</Text>
        <Text style={styles.description}>{resDet?.category}</Text>
        <Text style={styles.address}>{resDet?.address}</Text>
        <Text style={styles.rating}>Rating: {resDet?.rating}</Text>
        {/* saftey Images */}
        <View style={styles.safWrap}>
          <Image
            source={require("../assets/images/saf.jpg")}
            resizeMode="contain"
            style={styles.safImg}
          />
          <Image
            source={require("../assets/images/saf2.jpg")}
            resizeMode="contain"
            style={styles.safImg}
          />
        </View>
      </View>
      <View style={styles.menu}>
        <Ionicons name="fast-food-outline" size={24} />
        <Text style={styles.menuHead}>Menu</Text>
      </View>
    </>
  );

  //to fetch

  return (
    <SafeAreaView style={styles.container}>
      {!loading && error && <Error />}

      {loading && !error && <Spinner />}

      {!loading && !error && resDet && (
        <View style={styles.wrapper}>
          {/* menu list  */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={resDet.items}
              keyExtractor={(item) => item.id.toString()}
              style={{ padding: 5, marginTop: 2 }}
              ListHeaderComponent={<Header resDet={resDet} />}
              ListFooterComponent={<View style={{ height: 50 }} />}
              renderItem={({ item }) => (
                <MenuItem setCart={setCart} item={item} />
              )}
            />
          </View>
        </View>
      )}

      {/* floating cart  indicator */}

      {cart.length !== 0 && (
        <FloatingCartIndicator cart={cart} setIsCartOpen={setIsCartOpen} />
      )}

      {/* the cart */}
      {Platform.OS !== "web" && (
        <Cart
          cart={cart}
          orderItems={orderItems}
          setIsCartOpen={setIsCartOpen}
          removeFromCart={removeFromCart}
          state={{ isCartOpen, orderLoading }}
        />
      )}
    </SafeAreaView>
  );
}

//styles

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
    paddingTop: 1,
    flex: 1,
  },
  resDetails: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 15,
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
  address: {
    marginLeft: 5,
    color: "#716e6e",
    marginTop: 1,
  },
  rating: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 17,
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  menuHead: {
    fontSize: 24,
    fontWeight: "600",
    paddingLeft: 5,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 60,
    paddingTop: 7,
  },
  itemDet: {
    flex: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imgWrap: {
    shadowColor: "#ccc",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  itemCat: {
    fontSize: 14,
    color: "#716e6e",
    padding: 2,
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
  addBtnCont: {
    position: "absolute",
    bottom: -10,
    width: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
    backgroundColor: "#00000000",
  },
  safWrap: { padding: 5, display: "flex", flexDirection: "row" },
  safImg: { width: 50, height: 25, marginRight: 5, marginTop: 5 },

  line: {
    height: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  plusBtn: {
    padding: 1,
    borderWidth: 1,
    backgroundColor: "#fff6f6",
    borderColor: "#ea2635",
  },
});

export interface RestaurantDetailsResponse {
  address: string;
  category: string;
  city: string;
  createdAt: string;
  displayName: string;
  id: string | number;
  imgUrl: string;
  isVeg: boolean;
  items: Item[];
  phone: string;
  rating: string | number;
  updatedAt: string;
  userId: number;
}

interface HeaderProp {
  resDet: RestaurantDetailsResponse;
}
