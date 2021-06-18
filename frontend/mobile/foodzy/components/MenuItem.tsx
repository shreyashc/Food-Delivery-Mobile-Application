import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { Button } from "react-native-elements";
import { Item } from "../types";
import { VegNonVeg } from "./VegNonVeg";

export default function MenuItem({ item, setCart }: Props) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemDet}>
        <View style={styles.titleWrap}>
          <VegNonVeg isVeg={item.isVeg} showTxt={false} />
          <Text style={styles.itemTitle}> {item.title}</Text>
        </View>

        <Text style={styles.itemCat}>{"In " + item.category}</Text>
        <Text style={styles.itemPrice}>{"₹ " + item.price}</Text>

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
                  style={styles.plusIcon}
                />
              }
              title="ADD"
              titleStyle={{
                color: "#ea2635",
              }}
              buttonStyle={styles.plusBtn}
              onPress={() => {
                setCart((items) => {
                  if (!items.includes(item)) {
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
  );
}

interface Props {
  item: Item;
  setCart: React.Dispatch<React.SetStateAction<Item[]>>;
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 15,
    paddingTop: 7,
  },
  itemDet: {
    flex: 3,
    paddingRight: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imgWrap: {
    borderRadius: 12,
    backgroundColor: "#fff",
    ...Platform.select({
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: "#ccc",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
    }),
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 1,
    flex: 3,
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

  plusBtn: {
    padding: 1,
    borderWidth: 1,
    backgroundColor: "#fff6f6",
    borderColor: "#ea2635",
  },
  plusIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
