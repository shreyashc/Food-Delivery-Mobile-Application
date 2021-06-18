import * as React from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function Error() {
  return (
    <View style={styles.info}>
      <Text style={{ textAlign: "center", fontSize: 16, color: "#fb3877" }}>
        Something Went Wrong 😔
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
});
