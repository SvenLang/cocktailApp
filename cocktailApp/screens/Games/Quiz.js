import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { db_getRandomCocktail } from '../../utils/StorageHelper';
import { Button, Card } from 'react-native-elements';

export default class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			quizSolution: {
				thumbnail: undefined,
				id: 0,
				answers: [],
			},
			visible: false,

			buttonStyle0: styles.buttonStyle_normal,
			buttonStyle1: styles.buttonStyle_normal,
			buttonStyle2: styles.buttonStyle_normal,
			buttonStyle3: styles.buttonStyle_normal,
		};

		this.generateQuizData();
	}

	generateQuizData() {
		let maxRetries = 3;
		var quizSolution = {
			thumbnail: undefined,
			id: 0,
			answers: [],
		};

		// generate the correct Solution between 1 and 4
		var correctSolution = Math.floor(Math.random() * 4 + 1);

		// collect the promises and only move on, if the promises have been fulfilled
		var promises = [];

		//request 4 random Cocktails asynchronously
		for (let i = 0; i < 4; i++) {
			var promise = db_getRandomCocktail()
				.then(cocktail => {
					quizSolution.answers.push(cocktail.name);
					if (i === correctSolution) {
						if(cocktail.drinkThumb === undefined) {
							//get another Cocktail that has a thumbnail attached!
							i--;
							continue;
						} else {
							quizSolution.id = i;
							quizSolution.thumbnail = cocktail.drinkThumb;
						}
					}
				})
				.catch(error => {
					console.log(error);
					//if an error happens, try to load another Cocktail max. 3 times
					if (maxRetries > 0) {
						i--;
						maxRetries--;
					} else {
						this.setState({ error: true });
					}
				});
			promises.push(promise);
		}

		// When all promises have terminated, populate the game screen with the data
		Promise.all(promises).then(() => {
			this.setState({ quizSolution: quizSolution, visible: true });
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
		console.log(this.state);
		return (
			<View style={styles.container}>
				<Button title={'new'} onPress={() => this.generateQuizData()} />
				<View visible={this.state.visible}>
					<Card title="Quiz">
						<Image style={styles.image} source={{ uri: this.state.quizSolution.thumbnail }} />
						<Button
							title={this.state.quizSolution.answers[0]}
							buttonStyle={this.state.buttonStyle0}
							onPress={() => this.checkSolution(0)}
						/>
						<Button
							title={this.state.quizSolution.answers[1]}
							buttonStyle={this.state.buttonStyle1}
							onPress={() => this.checkSolution(1)}
						/>
						<Button
							title={this.state.quizSolution.answers[2]}
							buttonStyle={this.state.buttonStyle2}
							onPress={() => this.checkSolution(2)}
						/>
						<Button
							title={this.state.quizSolution.answers[3]}
							buttonStyle={this.state.buttonStyle3}
							onPress={() => this.checkSolution(3)}
						/>
					</Card>
				</View>
			</View>
		);
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
		height: 45,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_success: {
		backgroundColor: 'rgba(130, 250, 100, 1)',
		borderColor: 'transparent',
		height: 45,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_error: {
		backgroundColor: 'rgba(210, 50, 50, 1)',
		borderColor: 'transparent',
		height: 45,
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
