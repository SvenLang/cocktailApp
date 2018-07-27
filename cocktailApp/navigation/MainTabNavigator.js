import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CocktailList from '../screens/CocktailList';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RandomCocktail from '../screens/RandomCocktail';
import FavoriteList from "../screens/FavoriteList";

const CocktailStack = createStackNavigator({
	Cocktails: CocktailList,
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

const RandomCocktailStack = createStackNavigator({
	Random: RandomCocktail,
});

RandomCocktailStack.navigationOptions = {
	tabBarLabel: 'Random',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
        Platform.OS === "ios" ? `ios-link${focused ? "" : "-outline"}` : "random"
      }
      type="font-awesome"
		/>
	),
};

const LinksStack = createStackNavigator({
	Links: LinksScreen,
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
	Settings: SettingsScreen,
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

const CocktailDrawer = createDrawerNavigator(
	{
		AllCocktails: {
			path: '/',
			screen: CocktailStack,
		},
		RandCocktail: {
			path: '/',
			screen: RandomCocktailStack,
		},
	},
	{
		initialRouteName: 'AllCocktails',
		contentOptions: {
			activeTintColor: '#e91e63',
		},
	}
);

export default createBottomTabNavigator({
	CocktailStack,
  	FavoriteCocktailStack,
	LinksStack,
	SettingsStack,
	RandomCocktailStack,
});
