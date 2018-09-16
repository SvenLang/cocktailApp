import Expo, { SQLite, FileSystem as FS, Asset } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CocktailCard from '../components/CocktailCard';
import { getDrinks, getRandomDrink } from '../assets/drinks/DrinksInterface';
import {
	Container,
	Content,
	Form,
	Input,
	Label,
	Item,
	CheckBox,
	Picker,
	Button,
	Icon,
	Left,
	Body,
	Right,
	Text,
	Card,
	CardItem,
	H2,
	Textarea,
	ListItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

//database usage example!
// https://github.com/expo/test-suite/blob/master/tests/SQLite.js

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
		getRandomDrink('js')
			.then(cocktail => {
				console.log(cocktail);
				this.setState({ visible: true, selectedCocktail: cocktail });
			})
			.catch(error => {
				console.log(error);
				this.setState({ visible: false });
			});
	}

	render() {
		return (
			<View style={{ height: '100%', backgroundColor: 'rgba(230,250,250,1)' }}>
				<Container
					style={{
						backgroundColor: 'rgba(230,250,250,1)',
						alignItems: 'center',
						alignContent: 'center',
						marginBottom: 50,
					}}
				>
					<Content padder>
						<Grid>
							<Row size={1}>
								<Button
									full
									primary
									style={{ alignSelf: 'stretch', width: '100%' }}
									onPress={() => this.getRandomCocktail()}
								>
									<Text>New</Text>
								</Button>
							</Row>
							<Row size={10}>
								<CocktailCard
									visible={this.state.visible}
									cocktailToShow={this.state.selectedCocktail}
									onRequestClose={() => this.setState({ visible: false })}
									style={{ marginBottom: 150 }}
								/>
							</Row>
						</Grid>
					</Content>
				</Container>
			</View>
		);
	}

	// render what is displayed
	renderOld() {
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
