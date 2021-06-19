import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Icon, Input, Text } from "react-native-elements";
import apiClient from "../api/client";
import { AppContext } from "../contexts/contexts";

export default function LoginScreen({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = React.useState(false);

  const { dispatch } = React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const loginUser = () => {
    if (!email || !password) {
      Alert.alert("All fields are required!");
      return;
    }
    setLoading(true);

    apiClient
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.data });
        navigation.replace("Root");
      })
      .catch((err) => {
        const errObj = err.response.data.message;
        Alert.alert(errObj.field, errObj.message);
      })
      .finally(() => {
        setLoading(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <>
            <Input
              style={styles.inputText}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCompleteType="email"
              leftIcon={<Icon style={styles.inputIcon} name="email" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              leftIcon={<Icon style={styles.inputIcon} name="lock" />}
            />
            <Button
              activeOpacity={0.7}
              buttonStyle={styles.button}
              onPress={loginUser}
              title="Login"
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity
              activeOpacity={0.5}
              disabled={loading}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.linkText}>
                Don't have an account yet? Register now!
              </Text>
            </TouchableOpacity>
          </>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  inputText: {
    // color: "#fff",
    marginLeft: 6,
  },
  inputIcon: {
    color: "#fff",
  },
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
    backgroundColor: "#ff1200",
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
    color: "#000",
  },
});
