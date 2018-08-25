import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default class NewCockailScreen extends React.Component {
  static navigationOptions = {
    title: "Add new cocktail"
  };

  render() {
    return <ScrollView style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff"
  }
});
