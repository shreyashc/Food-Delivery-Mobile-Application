import * as React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "../types";

function FloatingCartIndicator({ cart, setIsCartOpen }: Props) {
  return (
    <View style={styles.floatingCart}>
      <Text style={{ flex: 3, fontSize: 15, color: "white" }}>
        {" "}
        {cart.length} {cart.length < 2 ? "item" : "items"} in Cart
      </Text>
      <Button
        title="View Cart "
        type="outline"
        titleStyle={{ fontSize: 15, color: "white", fontWeight: "500" }}
        icon={
          <Ionicons
            name="cart-outline"
            style={{ fontSize: 15, color: "white" }}
          />
        }
        iconRight
        buttonStyle={{ marginEnd: 8, borderColor: "white" }}
        onPress={() => {
          setIsCartOpen(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingCart: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ff3c58",
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
});

interface Props {
  cart: Item[];
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default FloatingCartIndicator;
