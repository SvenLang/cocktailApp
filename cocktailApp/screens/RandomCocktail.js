import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import CocktailCard from '../components/CocktailCard';
import { db_getRandomCocktail } from '../utils/StorageHelper';

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

	getRandomCocktail() {
		cocktail = db_getRandomCocktail()
			.then(cocktail => {
				console.log(cocktail);
				this.setState({ visible: true, selectedCocktail: cocktail });
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

	// set the styles
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
