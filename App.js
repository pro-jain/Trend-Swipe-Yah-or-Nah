import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Assuming Card component and trends data are imported from separate files
import Card from "./index.js";
import trends from "./trends.js";

const App = () => {
  const [translationX, setTranslationX] = useState(0);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX, // Animate the card's horizontal translation
      },
    ],
  }));

  const handleGestureEvent = (event) => {
    setTranslationX(withSpring(event.nativeEvent.translationX / 500 + 0.5));
  };

  useEffect(() => {
    const handleGestureEvent = (event) => {
      setTranslationX(withSpring(event.nativeEvent.translationX / 500 + 0.5)); // Update translation with animated spring effect
    };

    return () => {
          <View style={styles.pageBackground}>
            <Image
              source={require("./assets/bg.png")}
              style={styles.backgroundImage}
            />
            <View style={styles.pageContainer}>
              <Card trends={trends[0]} /> 
            </View>
          </View>;
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.pageBackground}>
      <Image
        source={require("./assets/bg.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.pageContainer}>
        <PanGestureHandler onGestureEvent={handleGestureEvent}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Card trends={trends[2]} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  pageBackground: {
    width: "100%",
    height: "100%",
    position: "cover",
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  pageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  animatedCard: {
    width: 300,
    height: 600,
  },
});

export default App;