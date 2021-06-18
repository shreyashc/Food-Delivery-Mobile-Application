import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, Image, RefreshControl, StyleSheet } from "react-native";
import { Rating, SearchBar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../api/client";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { Text, View } from "../components/Themed";
import { VegNonVeg } from "../components/VegNonVeg";
import { OrderParamList } from "../types";

export default function OrderScreen() {
  const navigation = useNavigation<
    StackNavigationProp<OrderParamList, "OrderScreen">
  >();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [restaurants, setRestaurants] = React.useState<RestaurnatResponse[]>(
    []
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [filteredRestaurants, setfilteredRestaurants] = React.useState<
    RestaurnatResponse[]
  >([]);

  const filterRestaurants = (txt: string) => {
    setSearchQuery(txt);
    txt = txt.toLocaleLowerCase().trim();

    if (txt === "") {
      setfilteredRestaurants(restaurants);
      return;
    }
    setfilteredRestaurants(() =>
      restaurants.filter((restu) =>
        restu.displayName.toLowerCase().includes(txt)
      )
    );
  };

  const getNearestRestaurants = () => {
    apiClient
      .get<RestaurnatResponse[]>("/nearest_restaurants")
      .then((res) => {
        setError(false);
        setRestaurants(res.data);
        setfilteredRestaurants(res.data);
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
    getNearestRestaurants();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons
          size={17}
          style={{ marginRight: 3 }}
          name="location-outline"
        />
        <Text style={styles.location}>Hassan, Karnataka, India</Text>
      </View>
      <SearchBar
        platform="ios"
        placeholder="Restaurant name, cuisine, or a dish"
        inputStyle={{ fontSize: 14 }}
        inputContainerStyle={styles.searchInput}
        containerStyle={styles.searchContainer}
        onChangeText={filterRestaurants}
        searchIcon={{ color: "red" }}
        value={searchQuery}
      />

      {!loading && error && <Error />}

      {loading && !error && <Spinner />}

      {!error && !loading && (
        <FlatList
          data={filteredRestaurants}
          style={{ padding: 10, marginTop: 5 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                getNearestRestaurants();
              }}
            />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RestaurantDetailsScreen", {
                  restaurantId: item.id,
                });
              }}
            >
              <View style={styles.restaurantContainer}>
                <Image
                  style={styles.restaurantImage}
                  source={
                    item.imgUrl
                      ? { uri: item.imgUrl }
                      : require("../assets/images/restaurant-wall.jpg")
                  }
                />
                <View style={styles.restaurantDetails}>
                  <Text style={styles.restaurantTitle}>{item.displayName}</Text>
                  <View style={styles.detWrap}>
                    <VegNonVeg isVeg={item.isVeg} />

                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                      }}
                    >
                      <Rating
                        type="heart"
                        ratingCount={5}
                        readonly={true}
                        startingValue={parseFloat(item.rating) || 1}
                        imageSize={20}
                        minValue={1}
                        style={{ paddingVertical: 5 }}
                      />
                      <Text style={styles.samllBoldTxt}>
                        {parseFloat(item.rating).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.restaurantCat}>{item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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

    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#4e90ff",
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
    marginHorizontal: 4,
  },

  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
});

interface RestaurnatResponse {
  address: string;
  city: string;
  createdAt: string;
  displayName: string;
  id: number;
  imgUrl: string;
  phone: string;
  updatedAt: string;
  userId: number;
  rating: string;
  category: string;
  isVeg: boolean;
}
