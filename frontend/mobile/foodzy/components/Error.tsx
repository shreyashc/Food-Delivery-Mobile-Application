import * as React from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export default function Error() {
  return (
    <View style={styles.info}>
      <ActivityIndicator
        style={{ marginTop: 20, marginBottom: 8 }}
        size="large"
        color="#fd3d3d"
      />
      <Text style={{ textAlign: "center", fontSize: 16, color: "#fb3877" }}>
        {"Spinning the wheel of fortune..."}
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
