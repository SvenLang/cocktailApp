import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
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
	constructor(props) {
		super(props);

		this.state = {
			//this needs to be undefined, otherwise the CocktailCard will be loaded instantly!
			selectedCocktail: undefined,
			visible: false,
		};

		this.getRandomCocktail();
	}

	getGeneralCocktailInfo(cocktail) {
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
				tx.executeSql(
					`SELECT c.id, c.name, c.rating, c.thumbnail, c.instruction, t.name as type, g.type as glass from (SELECT * from cocktails ORDER BY RANDOM() LIMIT 1) c LEFT JOIN types t ON t.id = c.type_id LEFT JOIN glasses g ON g.id = c.glass_id;`,
					[],
					(tx, results) => {
						cocktail.id = results.rows._array[0].id;
						cocktail.name = results.rows._array[0].name;
						cocktail.glass = results.rows._array[0].glass;
						cocktail.rating = results.rows._array[0].rating;
						cocktail.category = results.rows._array[0].type;
						cocktail.drinkThumb = results.rows._array[0].thumbnail;
						cocktail.instructions = results.rows._array[0].instruction;
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
							cocktail.ingredients.push({
								ingredient: element.ingredient,
								measure: element.measure,
							});
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
			rating: 0,
			category: null,
			drinkThumb: null,
			instructions: null,
			ingredients: [],
		};

		this.getGeneralCocktailInfo(cocktail)
			.then(cocktail => {
				this.fillCocktailWithIngredients(cocktail)
					.then(cocktail => {
						console.log(cocktail);
						this.setState({ visible: true, selectedCocktail: cocktail });
					})
					.catch(error => {
						console.log(error);
						this.setState({ visible: false });
					});
			})
			.catch(error => {
				console.log(error);
				this.setState({ visible: false });
			});
	}

	// render what is displayed
	render() {
		console.log('render randomCocktail');
		return (
			<View>
				<View>
					<Button
						title="New"
						onPress={() => this.getRandomCocktail()}
						buttonStyle={{
							backgroundColor: 'rgba(92, 99,216, 1)',
							borderColor: 'transparent',
							height: 45,
							borderWidth: 0,
							borderRadius: 15,
						}}
					/>
				</View>
				<View>
					<CocktailCard
						visible={this.state.visible}
						cocktailToShow={this.state.selectedCocktail}
						onRequestClose={() => this.setState({ visible: false })}
					/>
				</View>
			</View>
		);
	}

	// render() {
	// 	console.log('render randomCocktail');
	// 	return (
	// 		<View style={styles.container}>
	// 			<View style={styles.buttonBox}>
	// 				<Text>Button</Text>
	// 			</View>

	// 			<View style={styles.cocktailCardView}>
	// 				<Text>CocktailCard</Text>
	// 			</View>

	// 			<View style={styles.bottomBox}>
	// 				<Text>Bottom</Text>
	// 			</View>
	// 		</View>
	// 	);
	// }
}

// set the styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	buttonBox: {
		backgroundColor: 'green',
		height: 45,
	},
	cocktailCardView: {
		flex: 1,
		backgroundColor: 'red',
	},
	bottomBox: {
		backgroundColor: 'blue',
		height: 100,
	},

	// buttonBox: {
	// 	backgroundColor: 'green',
	// 	position: 'absolute',
	// 	top: 40,
	// 	right: 40,
	// 	height: 45,
	// },
});
