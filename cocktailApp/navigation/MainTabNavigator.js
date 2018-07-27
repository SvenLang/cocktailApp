import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
//import HomeScreen from "../screens/HomeScreen";
import CocktailList from "../screens/CocktailList";
import FavoriteList from "../screens/FavoriteList";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
/*
const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};
*/
const CocktailStack = createStackNavigator({
  Coktails: CocktailList
});

CocktailStack.navigationOptions = {
  tabBarLabel: "Cocktails",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="glass-tulip"
      type="material-community"
    />
  )
};

const FavoriteCocktailStack = createStackNavigator({
  FavoriteCocktails: FavoriteList
});

FavoriteCocktailStack.navigationOptions = {
  tabBarLabel: "Fav Cocktails",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-star"
      }
      type="ionicon"
    />
  )
};

const LinksStack = createStackNavigator({
  Links: LinksScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios" ? `ios-link${focused ? "" : "-outline"}` : "link"
      }
      type="entypo"
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-options${focused ? "" : "-outline"}`
          : "md-options"
      }
      type="ionicon"
    />
  )
};

export default createBottomTabNavigator({
  //HomeStack,
  CocktailStack,
  FavoriteCocktailStack,
  LinksStack,
  SettingsStack
});
