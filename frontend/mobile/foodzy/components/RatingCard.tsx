import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";

const RatingCard: React.FC<Props> = (props) => {
  const { children, title } = props;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {title === "" || React.isValidElement(title)
          ? title
          : title &&
            title.length && (
              <View>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {title}
                </Text>
              </View>
            )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    paddingVertical: 30,
    marginVertical: 20,
    marginBottom: 0,
    borderRadius: 8,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: "rgba(0,0,0, .2)",
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
    }),
  },

  wrapper: {
    backgroundColor: "transparent",
  },
  divider: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    color: "gray",
    ...Platform.select({
      default: {
        fontWeight: "bold",
      },
    }),
    textAlign: "center",
  },
});

interface Props {
  title: string;
}

export default RatingCard;
