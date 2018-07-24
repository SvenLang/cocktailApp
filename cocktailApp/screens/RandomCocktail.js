import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import CocktailCard from '../components/CocktailCard';

//The database needs to be downloaded first, otherwise a new empty database is created!
FS.downloadAsync(
	Asset.fromModule(require('../assets/drinks/drinksDB.db')).uri,
	`${FS.documentDirectory}SQLite/drinksDB.db`
);
const db = SQLite.openDatabase('drinksDB.db');

export default class RandomCocktail extends Component {
	// define initial variables that are required
	state = {
		text: 'This is some default context',
		number: 0,
		displayCocktail: false,
	};

	onError = (tx, error) => console.log(error);
	onSuccess = (tx, results) => this.setState({ text: results.rows._array[0].name });

	getRandomCocktail() {
		//get a random cocktail
		db.transaction(tx => {
			tx.executeSql(
				`SELECT * FROM cocktails ORDER BY RANDOM() LIMIT 1;`, //sql statement
				[], // parameters
				this.onSuccess,
				this.onError
			);
		});
		this.setState({ displayCocktail: true });
	}

	// render what is displayed
	render() {
		return (
			<View>
				<Button title="New Random Cocktail" onPress={() => this.getRandomCocktail()} />
				<Text>This is a Random Cocktail:</Text>
				<Text>{this.state.text}</Text>
			</View>
		);
	}

	// set the styles
}
