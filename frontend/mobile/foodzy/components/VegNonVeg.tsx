import * as React from "react";
import { Text, Image, View } from "react-native";

export const VegNonVeg: React.FC<Props> = ({ isVeg }) => {
  return (
    <View style={{ padding: 5, flexDirection: "row" }}>
      {isVeg ? (
        <>
          <Image
            source={require("../assets/images/veg.jpg")}
            resizeMode="contain"
            style={{
              height: 18,
              width: 18,
              marginRight: 10,
            }}
          />
          <Text style={{ marginRight: 8 }}>Veg</Text>
        </>
      ) : (
        <>
          <Image
            source={require("../assets/images/non.jpg")}
            resizeMode="contain"
            style={{
              height: 18,
              width: 18,
              marginRight: 10,
            }}
          />
          <Text style={{ marginRight: 8 }}>Non-Veg</Text>
        </>
      )}
    </View>
  );
};

interface Props {
  isVeg: boolean;
}
