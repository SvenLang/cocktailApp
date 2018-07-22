import Expo, { SQLite } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import CocktailCard from '../components/CocktailCard';

const db = SQLite.openDatabase('../assets/drinks/drinksDB.db');

export default class RandomCocktail extends Component {
	// define initial variables that are required
	state = {
		text: null,
		displayCocktail: false,
	};

	getRandomCocktail() {
		let row_id = 0;

		//get a random cocktail ID "SELECT id FROM cocktails ORDER BY RANDOM() LIMIT 1;
		db.transaction(tx => {
			tx.executeSQL(
				'SELECT id FROM cocktails ORDER BY RANDOM() LIMIT 1;', //sql statement
				null, // parameters
				(_, { rows: { _array } }) => this.setState({ text: { _array } }),
				() => this.setState({ text: 'Something went wrong' })
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
				<Text visible={this.state.displayCocktail}>{this.state.text}</Text>
			</View>
		);
	}

	// set the styles
}
