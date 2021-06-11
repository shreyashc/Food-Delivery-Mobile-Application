import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BottomSheet, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "../components/Themed";
import { OrderParamList } from "../types";

import apiClient, { setClientToken } from "../api/client";
import { VegNonVeg } from "../components/VegNonVeg";
import { AppContext } from "../contexts/contexts";
import { StackNavigationProp } from "@react-navigation/stack";

export default function RestaurantDetailsScreen() {
  //route
  const route = useRoute<
    RouteProp<OrderParamList, "RestaurantDetailsScreen">
  >();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const restaurantId = route.params.restaurantId;

  // user context
  const { appState } = React.useContext(AppContext);

  //state
  const [cart, setCart] = React.useState<Item[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [resDet, setResDet] = React.useState<RestaurantDetailsResponse>();
  const [items, setItems] = React.useState<Item[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [orderLoading, setOrderLoading] = React.useState(false);
  const [orderError, setOrderError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    apiClient
      .get<RestaurantDetailsResponse>(
        "/restautant_details_and_dishes/" + restaurantId
      )
      .then((res) => {
        setLoading(false);
        setError(false);
        setResDet(res.data);
        setItems(res.data.items);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
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
        navigation.push("MyOrders");
        console.log(res);
      })
      .catch((err) => {
        setOrderLoading(false);
        console.log(err);
      });
  };

  //to fetch

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* restaurant details  */}

        {!loading && error && (
          <View style={styles.info}>
            <Text
              style={{ textAlign: "center", fontSize: 16, color: "#fb3877" }}
            >
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
            <Text
              style={{ textAlign: "center", fontSize: 16, color: "#fb3877" }}
            >
              {"Spinning the wheel of fortune..."}
            </Text>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.wrapper}>
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

            {/* restaurant details end  */}

            <View style={styles.menu}>
              <Ionicons name="fast-food-outline" size={24} />
              <Text style={styles.menuHead}>Menu</Text>
            </View>

            {/* menu list  */}
            <View style={{ flex: 1 }}>
              <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                style={{ padding: 5, marginTop: 8 }}
                ListFooterComponent={<View style={{ height: 50 }} />}
                renderItem={({ item }) => (
                  <View style={{ flex: 1 }}>
                    <View style={styles.itemContainer}>
                      <View style={styles.itemDet}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemCat}>
                          {"In " + item.category}
                        </Text>
                        <Text style={styles.itemPrice}>
                          {"₹ " + item.price}
                        </Text>
                        <VegNonVeg isVeg={item.isVeg} />
                        <Text style={styles.itemDes}>{item.description}</Text>
                      </View>
                      <View>
                        <View style={styles.imgWrap}>
                          <Image
                            style={styles.itemImage}
                            source={
                              item.imgUrl
                                ? { uri: item.imgUrl }
                                : require("../assets/images/restaurant-wall.jpg")
                            }
                          />
                          <View style={styles.addBtnCont}>
                            <Button
                              icon={
                                <Ionicons
                                  name="add-sharp"
                                  color="#ea2635"
                                  size={15}
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                  }}
                                />
                              }
                              title="ADD"
                              titleStyle={{
                                color: "#ea2635",
                              }}
                              buttonStyle={styles.plusBtn}
                              onPress={() => {
                                setCart((items) => {
                                  if (item && !cart.includes(item)) {
                                    return [...items, item];
                                  }
                                  return items;
                                });
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        )}
        {/* cart 
          .
          . 
        
        */}

        {Platform.OS && (
          <BottomSheet
            modalProps={{}}
            isVisible={cart.length > 0 && isCartOpen}
            containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
          >
            <View
              style={{
                padding: 10,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            >
              <Text
                style={{
                  ...styles.itemTitle,
                  textAlign: "center",
                  margin: 10,
                  fontWeight: "300",
                  fontSize: 26,
                }}
              >
                Cart
              </Text>
              {cart.map((item) => (
                <View key={item.id.toString()} style={styles.cartItem}>
                  <View style={{ flex: 3 }}>
                    <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                      {item.title}
                    </Text>
                    <Text>{item.description}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "300" }}>
                      {"+ ₹" + item.price}
                    </Text>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => {
                        removeFromCart(item.id);
                      }}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        style={{ fontSize: 25, marginLeft: "auto" }}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "right",
                  paddingRight: 20,
                  marginTop: 10,
                }}
              >
                To Pay
                <Text
                  style={{
                    color: "#f36614",
                  }}
                >
                  {" "}
                  ₹{getTotal()}{" "}
                </Text>
              </Text>
            </View>
            {/* cart button  */}
            <View style={styles.cartFoot}>
              <View style={{ flexGrow: 1, margin: 2 }}>
                <Button
                  type="outline"
                  title="Close"
                  titleStyle={{ color: "gray" }}
                  buttonStyle={{ borderColor: "gray" }}
                  onPress={() => {
                    setIsCartOpen(false);
                  }}
                />
              </View>
              <View style={{ flexGrow: 1, margin: 2 }}>
                <Button
                  style={{ flexGrow: 1 }}
                  title="Order"
                  titleStyle={{ color: "white", fontWeight: "500" }}
                  buttonStyle={{ borderColor: "red", backgroundColor: "red" }}
                  disabled={orderLoading}
                  onPress={orderItems}
                />
              </View>
            </View>
          </BottomSheet>
        )}
      </SafeAreaView>

      {/* floating cart  indicator */}

      {cart.length !== 0 && (
        <View style={styles.floatingCart}>
          <Text style={{ flex: 3, fontSize: 15 }}>
            {" "}
            {cart.length} {cart.length < 2 ? "item" : "items"} in Cart
          </Text>
          <Button
            title="View Cart "
            type="outline"
            titleStyle={{ fontSize: 15, color: "green", fontWeight: "500" }}
            icon={
              <Ionicons
                name="cart-outline"
                style={{ fontSize: 15, color: "green" }}
              />
            }
            iconRight
            buttonStyle={{ marginEnd: 8, borderColor: "green" }}
            onPress={() => {
              setIsCartOpen(true);
            }}
          />
        </View>
      )}
    </>
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
  floatingCart: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#e9ffed",
    padding: 13,
    width: "95%",
    margin: "2.5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    borderRadius: 15,
  },
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
  cartItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

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
  cartFoot: { display: "flex", flexDirection: "row", padding: 15 },
});

interface Item {
  category: string;
  description: string;
  id: number;
  imgUrl: string;
  isVeg: boolean;
  price: number;
  restaurantId: number;
  title: string;
}

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
