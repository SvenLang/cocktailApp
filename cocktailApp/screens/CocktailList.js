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

const allDrinks = require("../assets/drinks/all-drinks.json");

export default class CocktailList extends React.Component {
  static navigationOptions = {
    title: "Cocktails"
  };

  render() {
    return (
      <List>
        <FlatList
          data={allDrinks}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={item.strDrink}
              subtitle={item.strCategory}
              avatar={{ uri: item.strDrinkThumb }}
            />
          )}
          keyExtractor={item => item.key.toString()}
          ListHeaderComponent={() => {
            return <SearchBar placeholder="Suche nach..." lightTheme round />;
          }}
          ListFooterComponent={() => {
            return (
              <View>
                <ActivityIndicator animating size="large" />
              </View>
            );
          }}
        />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  }
});
