import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ActivityIndicator,
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

  const { dispatch } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const loginUser = () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    apiClient
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        setLoading(false);
        setError(null);
        console.log("Success", res.data);
        dispatch({ type: "LOGIN", payload: res.data });
        navigation.replace("Root");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.message);
        console.log(err.response.data.message);
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
            {error && (
              <Text
                style={{ margin: 5, textAlign: "center", color: "#777777" }}
              >
                Invalid Username password
              </Text>
            )}
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
