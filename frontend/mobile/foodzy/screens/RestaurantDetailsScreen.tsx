import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { BottomSheet, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "../components/Themed";
import { OrderParamList } from "../types";

export default function RestaurantDetailsScreen() {
  //route
  const route = useRoute<
    RouteProp<OrderParamList, "RestaurantDetailsScreen">
  >();

  //state
  const [cart, setCart] = React.useState<Item[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

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
    return cart.reduce((prev, curr) => prev + parseFloat(curr.price), 0);
  };

  //to fetch
  const _reastaurantId = route.params.reastaurantId;

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* restaurant details  */}
        <View style={styles.wrapper}>
          <View style={styles.resDetails}>
            <Text style={styles.title}>Twist Restaurant</Text>
            <Text style={styles.description}>
              North Indian, South Indian, Fast Food
            </Text>
            <Text style={styles.address}>Hassan Locality, Hassan</Text>
            <Text style={styles.rating}>Rating: 4.4</Text>

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
          <View style={styles.line}></View>

          {/* restaurant details end  */}

          <View style={styles.menu}>
            <Text style={styles.menuHead}>Menu</Text>
          </View>

          {/* menu list  */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={dummyData}
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
                      <Text style={styles.itemPrice}>{"₹ " + item.price}</Text>
                      <Text style={styles.itemDes}>{item.description}</Text>
                    </View>
                    <View>
                      <Image
                        style={styles.itemImage}
                        source={require("../assets/images/restaurant-wall.jpg")}
                      />
                      <View style={styles.addBtnCont}>
                        <Button
                          icon={
                            <Ionicons
                              name="add-sharp"
                              color="#ea2635"
                              size={15}
                              style={{ position: "absolute", right: 0, top: 0 }}
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
              )}
            />
          </View>
        </View>

        {/* cart 
          .
          . 
        
        */}

        <BottomSheet
          modalProps={{}}
          isVisible={cart.length > 0 && isCartOpen}
          containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={{ padding: 15 }}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View>
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
                      name="ios-trash-bin-outline"
                      style={{ fontSize: 25, marginLeft: "auto" }}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View>
            <Text
              style={{ fontSize: 20, textAlign: "right", paddingRight: 20 }}
            >
              To Pay ₹{getTotal()}
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
                buttonStyle={{ borderColor: "green", backgroundColor: "green" }}
              />
            </View>
          </View>
        </BottomSheet>
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
    marginTop: 18,
  },
  menuHead: {
    fontSize: 24,
    fontWeight: "300",
    padding: 5,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 60,
  },
  itemDet: {
    flex: 3,
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
    bottom: -5,
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
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 15,
    borderBottomColor: "#ccc",
  },
  cartFoot: { display: "flex", flexDirection: "row", padding: 15 },
});

interface Item {
  id: string;
  title: string;
  price: string;
  category: string;
  description: string;
  imgUrl: string;
  isVeg: boolean;
}

const dummyData: Item[] = [
  {
    id: "id1",
    title: "Chicken Biriyani Combo",
    price: "200",
    category: "Non Veg Meal Combo",
    description: "Chicken Biriyani + 2 peice Kebab + Egg",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id2",
    title: "Chicken Kebab",
    price: "150",
    category: "Starters",
    description: "8 Large Piece",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id3",
    title: "Chicken Noodels Combo",
    price: "100",
    category: "Non Veg Meal Combo",
    description: "Chicken Noodels + 2 peice Kebab",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id4",
    title: "Egg Fried Rice",
    price: "200",
    category: "Non Veg Meal Combo",
    description: "Egg Fried Rice + 2 peice Kebab",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id5",
    title: "Egg Fried Rice",
    price: "200",
    category: "Non Veg Meal Combo",
    description: "Egg Fried Rice + 2 peice Kebab",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id6",
    title: "Egg Fried Rice",
    price: "200",
    category: "Non Veg Meal Combo",
    description: "Egg Fried Rice + 2 peice Kebab",
    imgUrl: "",
    isVeg: false,
  },
  {
    id: "id7",
    title: "Egg Fried Rice",
    price: "200",
    category: "Non Veg Meal Combo",
    description: "Egg Fried Rice + 2 peice Kebab",
    imgUrl: "",
    isVeg: false,
  },
];
