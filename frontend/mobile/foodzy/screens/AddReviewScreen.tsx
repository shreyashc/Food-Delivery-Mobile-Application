import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from "react-native";
import { AirbnbRating, Button, Input, Rating } from "react-native-elements";

import apiClient, { setClientToken } from "../api/client";
import RatingCard from "../components/RatingCard";
import { View, Text } from "../components/Themed";
import { AppContext } from "../contexts/contexts";
import { OrderParamList } from "../types";

export default function AddReviewScreen() {
  const route = useRoute<RouteProp<OrderParamList, "Reviews">>();
  const restaurantId = route.params.restaurantId;
  const navigation = useNavigation<StackNavigationProp<OrderParamList>>();

  const [loading, setLoading] = React.useState(false);

  const [foodQuality, setFoodQuality] = React.useState(1);
  const [foodQuantity, setFoodQuantity] = React.useState(1);
  const [foodDelivery, setFoodDelivery] = React.useState(1);
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState(false);

  const { appState } = React.useContext(AppContext);

  const postReview = () => {
    console.log({
      restaurantId,
      foodQuality,
      foodQuantity,
      foodDelivery,
      description,
    });

    if (!description) {
      Alert.alert("Description", "All fields are required");
      return;
    }
    setClientToken(appState.token);
    setLoading(true);
    apiClient
      .post("/post_review", {
        restaurantId,
        foodQuality,
        foodQuantity,
        foodDelivery,
        description,
      })
      .then((res) => {
        console.log(res);
        navigation.pop();
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert("Error", "Someting Went Wrong");
        console.log(err);
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS != "web") {
          Keyboard.dismiss();
        }
      }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.inputWrap}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>Description</Text>
          <Input
            placeholder="Description"
            value={description}
            multiline
            renderErrorMessage={false}
            onChangeText={setDescription}
          />
        </View>
        <RatingCard title="Food Quality">
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            minValue={1}
            startingValue={3}
            fractions={1}
            showRating
            style={{ paddingVertical: 10 }}
            onFinishRating={setFoodQuality}
          />
        </RatingCard>
        <RatingCard title="Food Quantity">
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            minValue={1}
            startingValue={3}
            fractions={1}
            showRating
            style={{ paddingVertical: 10 }}
            onFinishRating={setFoodQuantity}
          />
        </RatingCard>
        <RatingCard title="Food Delivery">
          <Rating
            type="heart"
            ratingCount={5}
            imageSize={40}
            minValue={1}
            startingValue={3}
            fractions={1}
            style={{ paddingVertical: 10 }}
            showRating
            onFinishRating={setFoodDelivery}
          />
        </RatingCard>
        <View
          style={{
            paddingVertical: 20,
            marginVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <Button
            title="Post Review"
            containerStyle={{ paddingHorizontal: 10 }}
            buttonStyle={{ backgroundColor: "#ff3c58" }}
            onPress={postReview}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
    height: 70,
  },

  inputWrap: {
    padding: 20,
    paddingBottom: 0,
  },
});
