import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomSheet, Button } from "react-native-elements";
import { Item } from "../types";

export default function Cart(props: Props) {
  const getTotal = () => {
    return props.cart.reduce((prev, curr) => prev + curr.price, 0);
  };

  return (
    <BottomSheet
      modalProps={{}}
      isVisible={props.cart.length > 0 && props.state.isCartOpen}
      containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
    >
      <View
        style={{
          padding: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#fff",
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
        {props.cart.map((item) => (
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
                  props.removeFromCart(item.id);
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
            paddingTop: 10,
            backgroundColor: "#fff",
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
              props.setIsCartOpen(false);
            }}
          />
        </View>
        <View style={{ flexGrow: 1, margin: 2, backgroundColor: "#fff" }}>
          <Button
            style={{ flexGrow: 1 }}
            title="Order"
            titleStyle={{ color: "white", fontWeight: "500" }}
            buttonStyle={{ borderColor: "red", backgroundColor: "#ff3c58" }}
            disabled={props.state.orderLoading}
            loading={props.state.orderLoading}
            onPress={props.orderItems}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 20,
    fontWeight: "500",
  },

  cartItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 13,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,

    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: "#ccc",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
      },
    }),
  },
  cartFoot: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
  },
});

interface Props {
  cart: Item[];
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeFromCart: (id: any) => void;
  orderItems: () => void;
  state: {
    isCartOpen: boolean;
    orderLoading: boolean;
  };
}
