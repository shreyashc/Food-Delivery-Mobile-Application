import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Input, Icon, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import { AppContext } from "../contexts/contexts";
import apiClient from "../api/client";

export default function LoginScreen({}) {
  const { appState, setAppState } = React.useContext(AppContext);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const navigation = useNavigation();

  const signupUser = () => {
    if (!email || !password || !name || !phone || !address) return;

    apiClient
      .post("/signup", {
        email,
        password,
        displayName: name,
        phone,
        address,
      })
      .then((res) => {
        setLoading(false);
        setError(false);
        console.log("Success");
        navigation.navigate("Login");
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
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
              placeholder="Name"
              autoCompleteType="name"
              onChangeText={setName}
              value={name}
              leftIcon={<Icon style={styles.inputIcon} name="person" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Email"
              autoCompleteType="email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              leftIcon={<Icon style={styles.inputIcon} name="email" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Password"
              value={password}
              keyboardType="visible-password"
              onChangeText={setPassword}
              secureTextEntry={true}
              leftIcon={<Icon style={styles.inputIcon} name="lock" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Phone"
              autoCompleteType="tel"
              onChangeText={setPhone}
              value={phone}
              keyboardType="phone-pad"
              leftIcon={<Icon style={styles.inputIcon} name="phone" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Address"
              autoCompleteType="street-address"
              onChangeText={setAddress}
              value={address}
              leftIcon={<Icon style={styles.inputIcon} name="home" />}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              disabled={loading}
              onPress={signupUser}
            >
              <Text style={styles.btnText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.linkText}>
                Already have an account? Login!
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

  linkText: {
    textAlign: "center",
    color: "#000",
  },
});
