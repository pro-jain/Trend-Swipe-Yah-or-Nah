import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import Card from "./index.js";
import trends from "./trends.js";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import yah from "./assets/yah.png";
import nah from "./assets/nah.png";

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  
  // State variables to track yah and nah counts
  const [yahCount, setYahCount] = useState(0);
  const [nahCount, setNahCount] = useState(0);

  const currentProfile = trends[currentIndex];
  const nextProfile = trends[nextIndex];

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

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.8, 1]
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.5, 1]
    ),
  }));

  const yahStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, hiddenTranslateX], [0, 5]),
  }));

  const nahStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -hiddenTranslateX], [0, 5]),
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      if (event.velocityX > 0) {
        runOnJS(setYahCount)(yahCount + 1);
      } else {
        runOnJS(setNahCount)(nahCount + 1);
      }

      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1)
      );
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.pageBackground}>
        <Image
          source={require("./assets/bg.png")}
          style={styles.backgroundImage}
        />
        <Image source={require("./assets/up.png")} style={styles.up} />
        <Image source={require("./assets/down.png")} style={styles.down} />
        <View style={styles.pageContainer}>
          {nextProfile && (
            <View style={styles.nextCardContainer}>
              <Animated.View style={[styles.card, nextCardStyle]}>
                <Card trends={nextProfile} screenWidth={screenWidth} />
              </Animated.View>
            </View>
          )}
          {currentProfile && (
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.animatedCard, cardStyle]}>
                <Card trends={currentProfile} screenWidth={screenWidth} />
                <Animated.Image
                  source={yah}
                  style={[styles.yah, { left: 10 }, yahStyle]}
                  resizeMode="contain"
                />
                <Animated.Image
                  source={nah}
                  style={[styles.yah, { right: 10 }, nahStyle]}
                  resizeMode="contain"
                />
              </Animated.View>
            </PanGestureHandler>
          )}
        </View>

        {/* Display yah and nah counts */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Yah: {yahCount}</Text>
          <Text style={styles.counterText}>Nah: {nahCount}</Text>
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  up: {
    width: "100%",
    height: "27%",
    position: "absolute",
    top: "2%",
    left: "0%",
  },
  down: {
    width: "100%", 
    height: "8%", 
    position: "absolute",
    bottom: "0%", 
    left: "0%", 
  },
  animatedCard: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  nextCardContainer: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    paddingRight: 20,
  },
  yah: {
    height: 100,
    width: 100,
    position: "absolute",
    bottom: -26,
    zIndex: 1,
    elevation: 100,
  },
  counterContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
  },
  counterText: {
    color: "#fff",
    fontSize: 18,
    marginHorizontal: 10,
  },
});

export default App;
