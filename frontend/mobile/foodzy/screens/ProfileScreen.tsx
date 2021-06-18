import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { removeClientTokenInterceptor } from "../api/client";
import { Text, View } from "../components/Themed";
import { AppContext } from "../contexts/contexts";

export default function ProfileScreen() {
  const { appState, dispatch } = React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileWrapper}>
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
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Ionicons
              name="ios-pencil"
              style={styles.profileIcon}
              size={25}
              color="#4630eb"
              onPress={() => {
                navigation.push("EditProfileScreen");
              }}
            />
          </View>
        </View>
        <View style={styles.moreDetails}>
          <Text style={styles.detailsHead}>
            Phone:
            <Text style={styles.detailsTxt}>
              {"  +91 " + appState?.user?.customer?.phone}
            </Text>
          </Text>
          <Text style={styles.detailsHead}>
            Address:
            <Text style={styles.detailsTxt}>
              {"  " + appState?.user?.customer?.address}
            </Text>
          </Text>
        </View>
      </View>
      <View style={{ padding: 15 }}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={() => {
            navigation.push("MyOrders");
          }}
        >
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
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={() => {
            removeClientTokenInterceptor();
            dispatch({ type: "LOGOUT" });
            navigation.replace("Login");
          }}
        >
          <Icon
            style={styles.profileIcon}
            reverse
            name="power"
            type="feather"
            size={15}
            color="#ff1200"
          />
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  },
  profileWrapper: {
    padding: 10,
    margin: 5,
    marginTop: 10,
    borderRadius: 20,
    shadowOffset: { height: 2, width: 1 },
    shadowColor: "#ccc",
    shadowOpacity: 0.9,
  },
  moreDetails: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  detailsHead: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 5,
  },
  detailsTxt: {
    fontWeight: "300",
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
    marginLeft: 10,
  },
});
