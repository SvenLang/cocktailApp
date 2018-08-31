import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { db_getRandomCocktail } from '../../utils/StorageHelper';
import { Button, Card } from 'react-native-elements';

export default class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			quizSolution: undefined,
			visible: false,
			displayGameData: false,
			buttonStyle0: styles.buttonStyle_normal,
			buttonStyle1: styles.buttonStyle_normal,
			buttonStyle2: styles.buttonStyle_normal,
			buttonStyle3: styles.buttonStyle_normal,
		};

		this.newGame();
	}

	newGame() {
		//get the game data
		this.generateQuizData()
			.then(quizSolution => {
				//With the data ready, populate the board
				this.setState({
					quizSolution: quizSolution,
					displayGameData: true,
					buttonStyle0: styles.buttonStyle_normal,
					buttonStyle1: styles.buttonStyle_normal,
					buttonStyle2: styles.buttonStyle_normal,
					buttonStyle3: styles.buttonStyle_normal,
				});
			})
			.catch(error => {
				//display an error message
				this.setState({
					error: error,
					displayGameData: false,
				});
			});
	}

	newRound() {}

	getRandomCocktail(tries) {
		tries = tries || 0;
		if (tries > 3) {
			throw new Error('Too many tries to get a random cocktail');
		}

		return new Promise((resolve, reject) => {
			db_getRandomCocktail()
				.then(cocktail => {
					resolve(cocktail);
				})
				.catch(error => {
					console.log(error);
					return getRandomCocktailWithID(tries + 1);
				});
		});
	}

	generateQuizData() {
		return new Promise((resolve, reject) => {
			let maxRetries = 3;
			var quizSolution = {
				id: 0,
				answers: [],
			};
			// collect the promises and only move on, if the promises have been fulfilled
			var promises = [];
			// generate the correct Solution between 1 and 4
			var solutionId = Math.floor(Math.random() * 4 + 1);

			//request 4 random Cocktails asynchronously
			for (let i = 0; i < 4; i++) {
				var promise;
				var promise = db_getRandomCocktail()
					.then(cocktail => {
						quizSolution.answers.push({ name: cocktail.name, thumbnail: cocktail.drinkThumb });
					})
					.catch(error => {
						console.log(error);
						reject(error);
					});
				promises.push(promise);
			}

			// When all promises have terminated, populate the game screen with the data
			Promise.all(promises)
				.then(() => {
					// Check if the solution does have a thumbnail attached
					if (typeof quizSolution.answers[quizSolution.id].thumbnail === 'undefined') {
						//Change the solution to a cocktail that does have a thumbnail attached
						var i = quizSolution.id === 3 ? 0 : quizSolution.id + 1;
						do {
							if (typeof quizSolution.answers[i].thumbnail === 'undefined') {
								if (i === 3) {
									i = 0;
								} else {
									i++;
								}
							} else {
								quizSolution.id = i;
							}
						} while (i != quizSolution.id);
					}
					resolve(quizSolution);
					//this.setState({ quizSolution: quizSolution, visible: true, displayGameData: true });
				})
				.catch(error => {
					console.log('Unable to generate quiz data: ' + error);
					reject(error);
				});
		});
	}

	checkSolution(id) {
		if (id === this.state.quizSolution.id) {
			this.setState({
				['buttonStyle' + id]: styles.buttonStyle_success,
			});
		} else {
			this.setState({
				['buttonStyle' + id]: styles.buttonStyle_error,
			});
		}
	}

	render() {
		console.log(this.state.quizSolution);

		if (this.state.displayGameData) {
			return (
				<View style={styles.container}>
					<Button title={'new'} onPress={() => this.newGame()} />
					<View visible={this.state.visible}>
						<Image
							style={styles.image}
							source={{ uri: this.state.quizSolution.answers[this.state.quizSolution.id].thumbnail }}
						/>
						<Button
							title={this.state.quizSolution.answers[0].name}
							buttonStyle={this.state.buttonStyle0}
							onPress={() => this.checkSolution(0)}
						/>
						<Button
							title={this.state.quizSolution.answers[1].name}
							buttonStyle={this.state.buttonStyle1}
							onPress={() => this.checkSolution(1)}
						/>
						<Button
							title={this.state.quizSolution.answers[2].name}
							buttonStyle={this.state.buttonStyle2}
							onPress={() => this.checkSolution(2)}
						/>
						<Button
							title={this.state.quizSolution.answers[3].name}
							buttonStyle={this.state.buttonStyle3}
							onPress={() => this.checkSolution(3)}
						/>
					</View>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<Button title={'new'} onPress={() => this.newGame()} />
					<Text>{this.state.error}</Text>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
	},
	buttongroup: {
		height: 30,
	},
	buttonStyle_normal: {
		backgroundColor: 'rgba(92, 99,216, 1)',
		borderColor: 'transparent',
		height: 30,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_success: {
		backgroundColor: 'rgba(130, 250, 100, 1)',
		borderColor: 'transparent',
		height: 30,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_error: {
		backgroundColor: 'rgba(210, 50, 50, 1)',
		borderColor: 'transparent',
		height: 30,
		borderWidth: 0,
		borderRadius: 15,
	},
	image: {
		width: 180,
		height: 180,
		alignSelf: 'center',
		marginBottom: 10,
	},
});
