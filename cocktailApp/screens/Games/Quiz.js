import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { db_getRandomCocktail } from '../../utils/StorageHelper';
import { Button } from 'react-native-elements';

export default class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			quizSolution: {
				thumbnail: undefined,
				name: undefined,
				id: 0,
				falseAnswers: [],
			},
			visible: false,
		};

		this.generateQuizData();
	}

	generateQuizData() {
		let maxRetries = 3;
		var quizSolution = {
			thumbnail: undefined,
			solution: undefined,
			id: 0,
			falseAnswers: [],
		};

		// generate the correct Solution between 1 and 4
		var correctSolution = Math.floor(Math.random() * 4 + 1);

		// collect the promises and only move on, if the promises have been fulfilled
		var promises = [];

		//request 4 random Cocktails asynchronously
		for (let i = 1; i < 5; i++) {
			var promise = db_getRandomCocktail()
				.then(cocktail => {
					if (i === correctSolution) {
						quizSolution.id = i;
						quizSolution.thumbnail = cocktail.drinkThumb;
						quizSolution.name = cocktail.name;
					} else {
						quizSolution.falseAnswers.push(cocktail.name);
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

	render() {
		return (
			<View style={styles.container}>
				<Button title={'new'} onPress={() => this.generateQuizData()} />
				<View visible={this.state.visible}>
					<Text>solution = {JSON.stringify(this.state.quizSolution)}</Text>
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
});
