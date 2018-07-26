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
	};

	getGeneralCocktailInfo(cocktail) {
		return new Promise((resolve, reject) => {
			console.log('start db transaction in getGeneralCocktailInfo');
			db.transaction(tx => {
				tx.executeSql(
					`SELECT c.id, c.name, c.thumbnail, c.instruction, t.name as type, g.type as glass from (SELECT * from cocktails ORDER BY RANDOM() LIMIT 1) c LEFT JOIN types t ON t.id = c.type_id LEFT JOIN glasses g ON g.id = c.glass_id;`,
					[],
					(tx, results) => {
						console.log('getGeneralCocktailInfo success');
						cocktail.id = results.rows._array[0].id;
						cocktail.name = results.rows._array[0].name;
						cocktail.glass = results.rows._array[0].glass;
						cocktail.type = results.rows._array[0].type;
						cocktail.thumbnail = results.rows._array[0].thumbnail;
						cocktail.instruction = results.rows._array[0].instruction;
						resolve(cocktail);
					},
					(tx, error) => {
						console.log(error);
						reject(error);
					}
				);
			});
		});
	}

	fillCocktailWithIngredients(cocktail) {
		return new Promise((resolve, reject) => {
			console.log('start db transaction in fillCocktailWithIngredients');
			db.transaction(tx => {
				tx.executeSql(
					`SELECT i.name as ingredient, r.measure FROM ingredients i JOIN recipes r ON i.id = r.ingredient_id JOIN cocktails c ON c.id = r.cocktail_id WHERE c.id = ?;`,
					[cocktail.id],
					(tx, results) => {
						console.log('fillCocktailwithIngredients success');
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

		console.log('1');
		this.getGeneralCocktailInfo(cocktail)
			.then(cocktail => {
				console.log('2');
				this.fillCocktailWithIngredients(cocktail)
					.then(cocktail => {
						console.log('3');
						this.setState({ text: JSON.stringify(cocktail) });
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => {
				console.log(error);
			});
		console.log('4');
	}

	// render what is displayed
	render() {
		console.log('render');
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
