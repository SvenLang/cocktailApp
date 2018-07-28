import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    title: "Search"
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
