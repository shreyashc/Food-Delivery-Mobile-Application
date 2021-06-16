import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon, Input } from "react-native-elements";
import { Text } from "../components/Themed";
import { AppContext } from "../contexts/contexts";

export default function EditProfileScreen() {
  const { appState, dispatch } = React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [phone, setPhone] = React.useState(
    appState?.user?.customer?.phone || ""
  );
  const [address, setAddress] = React.useState(
    appState?.user?.customer?.address || ""
  );

  const updateDetails = () => {
    dispatch({ type: "UPDATE_PROFILE", payload: { phone, address } });
    navigation.pop();
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>
          <>
            <Input
              style={styles.inputText}
              placeholder="Phone"
              onChangeText={setPhone}
              value={phone}
              leftIcon={<Icon style={styles.inputIcon} name="phone" />}
            />
            <Input
              style={styles.inputText}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              leftIcon={<Icon style={styles.inputIcon} name="home" />}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={updateDetails}
            >
              <Text style={styles.btnText}>Update Details</Text>
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
    fontSize: 18,
  },
  button: {
    color: "#fff",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#ff1200",
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
});
