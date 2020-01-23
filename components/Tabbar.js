import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Animated
} from "react-native";
// import { Svg } from "expo";
import { Svg, Path } from "react-native-svg";
import * as shape from "d3-shape";
import StaticTabbar from "./StaticTabbar";

const tabs = [
  { name: "grid", text: "نتایج" },
  { name: "list", text: "دسته" },
  { name: "repeat", text: "تکرار" },
  { name: "user", text: "پروفایل" },
  { name: "map", text: "نقشه" }
];
const { width } = Dimensions.get("window");

const tabWidth = width / tabs.length;
const height = 64;
//const AnimatedSvg = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const getPath = () => {
  const left = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    { x: 0, y: 0 },
    { x: width, y: 0 }
  ]);
  const tab = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBasis)([
    { x: width, y: 0 },
    { x: width + 5, y: 0 },
    { x: width + 10, y: 10 },
    { x: width + 15, y: height },
    { x: width + tabWidth - 15, y: height },
    { x: width + tabWidth - 10, y: 10 },
    { x: width + tabWidth - 5, y: 0 },
    { x: width + tabWidth, y: 0 }
  ]);
  const right = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
    { x: width + tabWidth, y: 0 },
    { x: width * 2.5, y: 0 },
    { x: width * 2.5, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 }
  ]);
  return `${left} ${tab} ${right}`;
};

export default class Tabbar extends Component {
  constructor(props) {
    super(props);
    this.value = new Animated.Value(-width);
  }

  render() {
    const d = getPath();
    const { value: translateX } = this;
    return (
      <>
        <View {...{ width, height }}>
          <AnimatedSvg
            width={width * 2.5}
            style={{ transform: [{ translateX }] }}
            {...{ height }}
            //  style={{ transform: [{ translateX: -100 }] }}
          >
            <Path {...{ d }} fill="#FDFDFD" />
          </AnimatedSvg>
          <View style={StyleSheet.absoluteFill}>
            <StaticTabbar value={translateX} {...{ tabs }} />
          </View>
        </View>
        <SafeAreaView style={styles.safeArea} />
      </>
    );
  }
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white"
  }
});
