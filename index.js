import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

const Card = (props) => {
  const { name, image, bio } = props.trends; 
  return (
    <View style={styles.card}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "85%",
    height: "70%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    marginTop:120,
    marginLeft:20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    paddingLeft: 22,
    lineHeight: 30,
  },
  bio: {
    fontSize: 14,
    color: "white",
    lineHeight: 15,
    paddingLeft: 22,
    paddingBottom: 30,
  },
});
export default Card;
