import React from 'react';
import { Platform, AppRegistry } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
//import HomeScreen from "../screens/HomeScreen";
import CocktailList from '../screens/CocktailList';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RandomCocktail from '../screens/RandomCocktail';

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
	Cocktails: CocktailList,
});

CocktailStack.navigationOptions = {
	tabBarLabel: 'Cocktails',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-list'}
		/>
	),
};

const RandomCocktailStack = createStackNavigator({
	Random: RandomCocktail,
});

RandomCocktailStack.navigationOptions = {
	tabBarLabel: 'Random',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-list'}
		/>
	),
};

const LinksStack = createStackNavigator({
	Links: LinksScreen,
});

LinksStack.navigationOptions = {
	tabBarLabel: 'Links',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
		/>
	),
};

const SettingsStack = createStackNavigator({
	Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
	tabBarLabel: 'Settings',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
		/>
	),
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
	//HomeStack,
	CocktailStack,
	LinksStack,
	SettingsStack,
	RandomCocktailStack,
});
