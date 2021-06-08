import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-elements";

import { Text, View } from "../components/Themed";
import { AppContext } from "../contexts/contexts";

export default function ProfileScreen() {
  const { appState, dispatch } = React.useContext(AppContext);
  console.log(appState.user);

  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Icon
          style={styles.profileIcon}
          reverse
          name="person-outline"
          type="ionicon"
          color="#ff1200"
          size={30}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {appState?.user?.customer?.displayName}
          </Text>
          <Text style={styles.userEmail}>{appState?.user?.email}</Text>
        </View>
      </View>
      <View style={{ padding: 15 }}>
        <TouchableOpacity style={styles.btn} activeOpacity={0.7}>
          <Icon
            style={styles.profileIcon}
            reverse
            name="cart"
            type="ionicon"
            size={15}
          />
          <Text style={styles.btnText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} activeOpacity={0.7}>
          <Icon
            style={styles.profileIcon}
            reverse
            name="shopping-bag"
            type="feather"
            size={15}
          />
          <Text style={styles.btnText}>Your orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} activeOpacity={0.7}>
          <Icon
            style={styles.profileIcon}
            reverse
            name="information"
            type="ionicon"
            size={15}
          />
          <Text style={styles.btnText}>About</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Logout"
        style={{ width: "100%" }}
        buttonStyle={{ backgroundColor: "#777777", margin: 10 }}
        onPress={() => {
          dispatch({ type: "LOGOUT" });
          navigation.replace("Login");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  userDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 35,
    textTransform: "capitalize",
  },
  userEmail: {
    fontSize: 15,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,
    marginTop: 10,
    borderRadius: 20,
    shadowOffset: { height: 2, width: 1 },
    shadowColor: "#ccc",
    shadowOpacity: 0.9,
  },
  profileIcon: {
    marginRight: 15,
  },
  optionMenu: {
    marginTop: 10,
  },
  btn: {
    margin: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: {
    fontSize: 17,
  },
});
