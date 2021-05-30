import * as React from "react";
import { useContext, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Input, Icon, Button, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { View } from "../components/Themed";
import { AppContext } from "../Providers/contexts";
import { StatusBar } from "expo-status-bar";

export default function LoginScreen({}) {
  const { appState, setAppState } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const auth = () => setAppState({ isAuth: true });
  return (
    <View style={[styles.container]}>
      <StatusBar style={"light"} />
      <ImageBackground
        blurRadius={3}
        style={[styles.img]}
        source={require("../assets/images/heroimg.jpg")}
      >
        <Text style={styles.heroText}>Foodzy</Text>
        <Input
          style={styles.inputText}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#fff"
          leftIcon={<Icon style={styles.inputIcon} name="email" color="#fff" />}
        />
        <Input
          style={styles.inputText}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#fff"
          secureTextEntry={true}
          leftIcon={<Icon style={styles.inputIcon} name="lock" color="#fff" />}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={auth}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.linkText}>
            Don't have an account yet? Register now!
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputText: {
    color: "#fff",
    marginLeft: 6,
  },
  inputIcon: {},
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  button: {
    color: "#fff",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#FFA500",
  },
  img: {
    resizeMode: "cover",
    height: Dimensions.get("screen").height,
  },
  heroText: {
    fontSize: 80,
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 50,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: -2, height: 3 },
    textShadowRadius: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#fff",
  },
});
