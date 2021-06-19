import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  CardField,
  initStripe,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import * as React from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Button from "react-native-elements/dist/buttons/Button";
import PaymentWrapper from "../components/PaymentsWrapper";
import { View } from "../components/Themed";
import { STRIPE_PK } from "../constants/stripe";
import { RootStackParamList } from "../types";

export default function PaymentScreen() {
  const { confirmPayment, loading } = useConfirmPayment();
  const route = useRoute<RouteProp<RootStackParamList, "Payment">>();
  const clientSecret = route.params.clientSecret;
  const totalAmount = route.params.totalAmount;
  const noOfItems = route.params.noOfItems;

  const [pageLoading, setPageLoading] = React.useState(true);
  const navigation = useNavigation();

  React.useEffect(() => {
    async function initialize() {
      const publishableKey = STRIPE_PK;
      if (publishableKey) {
        await initStripe({
          publishableKey,
        });
        setPageLoading(false);
      }
    }
    initialize();
  }, []);

  const handlePayPress = async () => {
    const { error } = await confirmPayment(clientSecret, {
      type: "Card",
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.navigate("MyOrders");
    }
  };
  return (
    <PaymentWrapper>
      <View style={styles.container}>
        <Text style={styles.head}>
          Total Amount : <Text style={styles.val}>₹ {totalAmount} </Text>
        </Text>
        <Text style={styles.head}>
          No of Items: <Text style={styles.val}>{noOfItems} </Text>
        </Text>
        <Text style={styles.head}>
          Billing Address: <Text style={styles.val}>Default Address </Text>
        </Text>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20,
            color: "#5469d4",
          }}
        >
          Enter Credit Card Details
        </Text>
      </View>
      <View style={styles.container}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={{
            width: "100%",
            padding: 20,
            marginVertical: 5,
          }}
        />

        <Button
          disabled={loading}
          onPress={handlePayPress}
          title="Pay"
          buttonStyle={{
            backgroundColor: "#5469d4",
            marginTop: 10,
          }}
          loading={loading}
        />
      </View>
    </PaymentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 1 },
  },
  head: {
    fontSize: 16,
    marginVertical: 5,
  },
  val: {
    fontWeight: "600",
    marginVertical: 5,
  },
});
