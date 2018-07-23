import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator
} from "react-native";

import { List, ListItem, SearchBar } from "react-native-elements";

import CocktailCard from "../components/CocktailCard";

export default class FavoriteList extends React.Component {
  static navigationOptions = {
    title: "Cocktails"
  };

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  }
});
