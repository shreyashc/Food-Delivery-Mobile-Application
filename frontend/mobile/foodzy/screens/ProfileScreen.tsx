import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {Avatar, Icon} from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, View } from "../components/Themed";

export default function ProfileScreen() {
  return (
    <View>
      <View style={styles.profileContainer}>
        <Icon
          style={styles.profileIcon}
          reverse
          name='person'
          type='ionicon'
          size={30}
        />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@gmail.com</Text>
      </View>
      </View>
          <TouchableOpacity
            style={styles.btn} 
            activeOpacity={0.7}>
              <Icon
            style={styles.profileIcon}
            reverse
            name='cart'
            type='ionicon'
            size={15}
        />
              <Text style={styles.btnText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn} 
            activeOpacity={0.7}>
              <Icon
            style={styles.profileIcon}
            reverse
            name='shopping-bag'
            type='feather'
            size={15}
        />
              <Text style={styles.btnText}>Your orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn} 
            activeOpacity={0.7}>
              <Icon
            style={styles.profileIcon}
            reverse
            name='information'
            type='ionicon'
            size={15}
        />
              <Text style={styles.btnText}>About</Text>
          </TouchableOpacity>
      </View>

  );
}

const styles = StyleSheet.create({
  userDetails:{

  },
  userName:{
    fontSize:35,
    textTransform:"capitalize",
  },
  userEmail : {
    fontSize:15,
  },
  profileContainer :{
    display:"flex",
    flexDirection : "row",
    alignItems: "center",
    padding : 15,
  },
  profileIcon :{
    marginRight:15,
  },
  optionMenu :{
    marginTop:10,
  },
  btn:{
    margin:10,
    borderRadius:5,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText:{
    fontSize:17,
  },
});
