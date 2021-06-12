import { initStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { STRIPE_PK } from "../constants/stripe";
import { colors } from "../constants/StripeColors";

interface Props {
  paymentMethod?: string;
}

const PaymentWrapper: React.FC<Props> = ({ paymentMethod, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const publishableKey = STRIPE_PK;
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: undefined,
        });
        setLoading(false);
      }
    }
    initialize();
  }, []);

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <ScrollView
      accessibilityLabel="payment-screen"
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

export default PaymentWrapper;
