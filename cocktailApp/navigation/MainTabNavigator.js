import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import Cocktails from "../screens/Cocktails";
import SearchScreen from "../screens/SearchScreen";
import GameScreen from "../screens/GameScreen";
import NewCocktailScreen from "../screens/NewCocktailScreen";

const CocktailsStack = createStackNavigator({
  Cocktails: Cocktails
});

CocktailsStack.navigationOptions = {
  tabBarLabel: "Cocktails",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "glass-tulip"
      }
      type="material-community"
    />
  )
};

const SearchStack = createStackNavigator({
  Search: SearchScreen
});

SearchStack.navigationOptions = {
  tabBarLabel: "Search",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "search"
      }
      type=""
    />
  )
};

const NewCocktailStack = createStackNavigator({
  NewCocktail: NewCocktailScreen
});

NewCocktailStack.navigationOptions = {
  tabBarLabel: "New Cocktail",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "add"
      }
      type=""
    />
  )
};

const GamesStack = createStackNavigator({
  Games: GameScreen
});

GamesStack.navigationOptions = {
  tabBarLabel: "Games",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-game-controller-b"
      }
      type="ionicon"
    />
  )
};

export default createBottomTabNavigator({
  CocktailsStack,
  SearchStack,
  NewCocktailStack,
  GamesStack
});
