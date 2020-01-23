import React, { Component } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
export const tabHeight = 64 

export default class StaticTabbar extends Component {
  values: Animated.Value[] = [];
  

  constructor(props: StaticTabbarProps) {
    super(props);
    const { tabs } = this.props;
    this.values = tabs.map(
      (tab, index) => new Animated.Value(index === 0 ? 1 : 0)
    );
    }
  onPress = (index: number) => {
    const { value, tabs } = this.props;
    const tabWidth = width / tabs.length;
    //console.log("info",tabWidth,this.values)
    Animated.sequence([
        ...this.values.map(v =>
          Animated.timing(v, {
            toValue: 0, 
            duration: 50,
            useNativeDriver: true
          })),
      Animated.parallel([
        Animated.spring(this.values[index], {
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.spring(value, {
          toValue: -width+tabWidth*index ,
          useNativeDriver: true
        })
      ])
    ]) .start();
  };
  render() {
    const { onPress } = this;
    const { tabs , value } = this.props;
    const tabWidth = width/tabs.length
    return (
      <View style={styles.container}>
        {tabs.map((tab, key) => {
          const opacity = value.interpolate({
            inputRange: [-width+tabWidth * (key-1), -width+tabWidth*key, -width + tabWidth * (key+1)],
            outputRange: [1, 0, 1],
            extrapolate: "clamp"
          });
          const translateY = this.values[key].interpolate({
            inputRange: [0, 1],
            outputRange: [tabHeight, 0],
            extrapolate: "clamp"
          });
          const opacity1 = this.values[key].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp"
          });
          const opacity2 = this.values[key].interpolate({
            inputRange: [ 0, 0.5,1],
            outputRange: [ 0, .5,1],
            extrapolate: "clamp"
          });
          return (
            <React.Fragment {...{ key }}>
              <TouchableWithoutFeedback onPress={() => this.onPress(key)} >
                <Animated.View style={[styles.tab, { opacity }]}>
                  <Icon name={tab.name} color="black" size={25} />
                  <Text>{tab.text}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={{
                  position: "absolute",
                  top:-8,
                  left: tabWidth * key,
                  width: tabWidth,
                  height: tabHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: opacity1,
                  transform: [{ translateY }]
                }}
              >
                <Animated.View style={[styles.circle,{ opacity:opacity2}]}>
                  <Icon name={tab.name} color="black" size={20} />
                </Animated.View>
              </Animated.View>
            </React.Fragment>
          );
        })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
   // backgroundColor: "white"
  },
  tab: {
    flex: 1,
    height: tabHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  circle: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});
