import React from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import Card from "./index.js";
import trends from "./trends.js";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const ROTATION = 60;

const App = () => {
  const { width: screenWidth } = useWindowDimensions();
  const hiddenTranslateX = 2 * screenWidth;
  const translateX = useSharedValue(0);
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      "deg"
  );
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: rotate.value }],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: () => {
      console.warn("Touch ended");
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.pageBackground}>
        <Image
          source={require("./assets/bg.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.pageContainer}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              <Card trends={trends[2]} screenWidth={screenWidth} />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  pageBackground: {
    width: "100%",
    height: "100%",
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
