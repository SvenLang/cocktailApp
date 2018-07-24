import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import CocktailCard from '../components/CocktailCard';

//database usage example!

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
		displayCocktail: false,
	};

	// define the standard structure of a cocktail, before it is being filled
	cocktail = {
		id: null,
		name: null,
		glass: null,
		type: null,
		thumbnail: null,
		instruction: null,
		ingredients: [],
	};

	getGeneralCocktailInfo() {
		onSuccess = (tx, results) => {
			this.cocktail.id = results.rows._array[0].id;
			this.cocktail.name = results.rows._array[0].name;
			this.cocktail.glass = results.rows._array[0].glass;
			this.cocktail.type = results.rows._array[0].type;
			this.cocktail.thumbnail = results.rows._array[0].thumbnail;
			this.cocktail.instruction = results.rows._array[0].instruction;
		};
		db.transaction(tx => {
			tx.executeSql(
				`SELECT c.id, c.name, c.thumbnail, c.instruction, t.name as type, g.type as glass from (SELECT * from cocktails ORDER BY RANDOM() LIMIT 1) c LEFT JOIN types t ON t.id = c.type_id LEFT JOIN glasses g ON g.id = c.glass_id;`,
				[],
				onSuccess,
				(tx, error) => {
					console.log(error);
				}
			);
		});
	}

	fillCocktailWithIngredients() {
		onSuccess = (tx, results) => {
			results.rows._array.forEach(element => {
				this.cocktail.ingredients.push({ ingredient: element.ingredient, measure: element.measure });
			});
		};
		db.transaction(tx => {
			tx.executeSql(
				`SELECT i.name as ingredient, r.measure FROM ingredients i JOIN recipes r ON i.id = r.ingredient_id JOIN cocktails c ON c.id = r.cocktail_id WHERE c.id = ?;`,
				[this.cocktail.id],
				onSuccess,
				(tx, error) => {
					console.log(error);
				}
			);
		});
	}

	getRandomCocktail() {
		this.getGeneralCocktailInfo();
		//this.fillCocktailWithIngredients();
		this.setState({ text: JSON.stringify(this.cocktail) });
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
