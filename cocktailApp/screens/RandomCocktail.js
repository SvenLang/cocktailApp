import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import CocktailCard from '../components/CocktailCard';

//database usage example!
// https://github.com/expo/test-suite/blob/master/tests/SQLite.js

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
		visible: false,
	};

	getGeneralCocktailInfo(cocktail) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				tx.executeSql(
					`SELECT c.id, c.name, c.thumbnail, c.instruction, t.name as type, g.type as glass from (SELECT * from cocktails ORDER BY RANDOM() LIMIT 1) c LEFT JOIN types t ON t.id = c.type_id LEFT JOIN glasses g ON g.id = c.glass_id;`,
					[],
					(tx, results) => {
						cocktail.id = results.rows._array[0].id;
						cocktail.name = results.rows._array[0].name;
						cocktail.glass = results.rows._array[0].glass;
						cocktail.type = results.rows._array[0].type;
						cocktail.thumbnail = results.rows._array[0].thumbnail;
						cocktail.instruction = results.rows._array[0].instruction;
						resolve(cocktail);
					},
					(tx, error) => {
						reject(error);
					}
				);
			});
		});
	}

	fillCocktailWithIngredients(cocktail) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				tx.executeSql(
					`SELECT i.name as ingredient, r.measure FROM ingredients i JOIN recipes r ON i.id = r.ingredient_id JOIN cocktails c ON c.id = r.cocktail_id WHERE c.id = ?;`,
					[cocktail.id],
					(tx, results) => {
						results.rows._array.forEach(element => {
							cocktail.ingredients.push({ ingredient: element.ingredient, measure: element.measure });
						});
						resolve(cocktail);
					},
					(tx, error) => {
						reject(error);
					}
				);
			});
		});
	}

	getRandomCocktail() {
		let cocktail = {
			id: null,
			name: null,
			glass: null,
			type: null,
			thumbnail: null,
			instruction: null,
			ingredients: [],
		};

		this.getGeneralCocktailInfo(cocktail)
			.then(cocktail => {
				this.fillCocktailWithIngredients(cocktail)
					.then(cocktail => {
						this.setState({ text: JSON.stringify(cocktail), visible: true });
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => {
				console.log(error);
			});
	}

	// render what is displayed
	render() {
		console.log('render');
		return (
			<View>
				<Button title="New Random Cocktail" onPress={() => this.getRandomCocktail()} />
				<Text>This is a Random Cocktail:</Text>
				<Text>{this.state.text}</Text>

				<CocktailCard visible={true} name={this.state.text.name} glass={this.state.text.glass} pic={this.state.text.thumbnail} category={this.state.text.type} instructions={this.state.text.instructions} ingredients={this.state.text.ingredients} />

			</View>
		);
	}

	// set the styles
}
