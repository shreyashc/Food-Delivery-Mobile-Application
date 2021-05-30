import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import { SearchBar, Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, View } from "../components/Themed";
import { OrderParamList } from "../types";

export default function OrderScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const navigation = useNavigation<
    StackNavigationProp<OrderParamList, "OrderScreen">
  >();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons
          size={17}
          style={{ marginRight: 3 }}
          name="location-outline"
        />
        <Text style={styles.location}>Hassan, Karnataka, India</Text>
        <Avatar
          rounded
          icon={{ name: "user", type: "font-awesome" }}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
          containerStyle={{ marginLeft: 20, marginTop: 11 }}
        />
      </View>
      <SearchBar
        platform="ios"
        placeholder="Restaurant name, cuisine, or a dish"
        inputStyle={{ fontSize: 14 }}
        inputContainerStyle={styles.searchInput}
        containerStyle={styles.searchContainer}
        onChangeText={setSearchQuery}
        searchIcon={{ color: "red" }}
        value={searchQuery}
      />
      <FlatList
        data={[
          {
            id: "id1",
            title: "Parijatha Restaurant",
            category: "South Indian, North Indian, Andhra",
            rating: 4.1,
            isVeg: true,
          },
          {
            id: "id2",
            title: "Parijatha Restaurant",
            category: "South Indian, North Indian, Andhra",
            rating: 4.1,
            isVeg: false,
          },
          {
            id: "id3",
            title: "Parijatha Restaurant",
            category: "South Indian, North Indian, Andhra",
            rating: 4.1,
            isVeg: true,
          },
          {
            id: "id4",
            title: "Parijatha Restaurant",
            category: "South Indian, North Indian, Andhra",
            rating: 4.1,
            isVeg: true,
          },
        ]}
        style={{ padding: 10, marginTop: 5 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              navigation.navigate("RestaurantDetailsScreen", {
                reastaurantId: item.id,
              });
            }}
          >
            <View style={styles.restaurantContainer}>
              <Image
                style={styles.restaurantImage}
                source={require("../assets/images/restaurant-wall.jpg")}
              />
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantTitle}>{item.title}</Text>
                <View style={styles.detWrap}>
                  <View style={styles.restaurantRating}>
                    <Text style={styles.samllBoldTxt}>{item.rating} ⭐ </Text>
                  </View>
                  <View style={item.isVeg ? styles.veg : styles.nonveg}>
                    <Text style={styles.samllBoldTxt}>
                      {item.isVeg ? "veg" : "non-veg"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.restaurantCat}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  location: {
    fontSize: 15,
    fontWeight: "bold",
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 5,
  },
  searchContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    margin: 10,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  searchInput: {
    backgroundColor: "#ffffff",
  },
  restaurantContainer: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#ccc",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    marginBottom: 20,
  },
  restaurantImage: {
    width: "auto",
    height: 150,
  },
  restaurantTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "600",
  },
  restaurantDetails: {
    paddingTop: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 14,
  },
  restaurantCat: {
    fontSize: 14,
    fontWeight: "300",
    padding: 2,
    marginTop: 5,
  },
  restaurantRating: {
    padding: 5,
    borderRadius: 4,
    marginRight: 14,
    backgroundColor: "#4e90ff",
  },
  detWrap: {
    display: "flex",
    flexDirection: "row",
  },
  veg: {
    backgroundColor: "#0aa50a",
    padding: 5,
    borderRadius: 4,
  },
  nonveg: {
    backgroundColor: "#d63a3a",
    padding: 5,
    borderRadius: 4,
  },
  samllBoldTxt: {
    fontWeight: "bold",
    color: "white",
  },
});
