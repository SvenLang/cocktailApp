import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { db_getRandomCocktail } from '../../utils/StorageHelper';
import { Button } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class Quiz extends React.Component {
	/**
	 * Called upon clicking on the navigation tab of the quiz game.
	 * Initializes the state with the default values and starts a new game.
	 * At the moment, there are no properties that are passed along.
	 */
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			quizSolution: undefined,
			visible: false,
			displayGameData: false,
			points: 0,
			button0_style: styles.buttonStyle_normal,
			button1_style: styles.buttonStyle_normal,
			button2_style: styles.buttonStyle_normal,
			button3_style: styles.buttonStyle_normal,
			button0_disabled: false,
			button1_disabled: false,
			button2_disabled: false,
			button3_disabled: false,
			disabled_buttonIds: [],
		};

		this.newGame();
	}

	/**
	 * Generating a new dataset for the quiz while resetting the buttons, points
	 * etc. are all reset to their default start values.
	 * Requested explicitly upon clicking on the 'New Game' button.
	 */
	newGame() {
		//get the game data
		this.generateQuizData()
			.then(quizSolution => {
				//With the data ready, populate the board
				this.setState({
					quizSolution: quizSolution,
					displayGameData: true,
					points: 0,
					button0_style: styles.buttonStyle_normal,
					button1_style: styles.buttonStyle_normal,
					button2_style: styles.buttonStyle_normal,
					button3_style: styles.buttonStyle_normal,
					button0_disabled: false,
					button1_disabled: false,
					button2_disabled: false,
					button3_disabled: false,
					disabled_buttonIds: [],
				});
			})
			.catch(error => {
				console.log('NewGameError:' + error);

				//display an error message
				this.setState({
					error: error,
					displayGameData: false,
				});
			});
	}

	/**
	 * As with the newGame function this generates a new dataset and resets the button colors,
	 * however the points are not reset, as the game is still considered to be ongoing.
	 * Invoked automatically as soon as an answer was provided.
	 */
	newRound() {
		//get the game data
		this.generateQuizData()
			.then(quizSolution => {
				//With the data ready, populate the board
				this.setState({
					quizSolution: quizSolution,
					displayGameData: true,
					button0_style: styles.buttonStyle_normal,
					button1_style: styles.buttonStyle_normal,
					button2_style: styles.buttonStyle_normal,
					button3_style: styles.buttonStyle_normal,
					button0_disabled: false,
					button1_disabled: false,
					button2_disabled: false,
					button3_disabled: false,
					disabled_buttonIds: [],
				});
			})
			.catch(error => {
				console.log('NewGameError:' + error);

				//display an error message
				this.setState({
					error: error,
					displayGameData: false,
				});
			});
	}

	/**
	 * Generates a new set of quiz data by requesting for random cocktails and storing them
	 * in the correct format. Also automatically sets the new correct solution.
	 */
	generateQuizData() {
		return new Promise((resolve, reject) => {
			var quizSolution = {
				id: 0,
				answers: [],
			};
			// collect the promises and only move on, if the promises have been fulfilled
			var promises = [];
			// generate the correct Solution between 0 and 3
			quizSolution.id = Math.floor(Math.random() * 4);

			//request 4 random Cocktails asynchronously
			for (let i = 0; i < 4; i++) {
				var promise;
				var promise = db_getRandomCocktail()
					.then(cocktail => {
						quizSolution.answers.push({
							name: cocktail.name,
							thumbnail: cocktail.drinkThumb,
							instructions: cocktail.instructions,
						});
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
					console.log(
						'Generated data from random cocktails, evaluate thumbnail:' + JSON.stringify(quizSolution)
					);
					// Check if the solution does have a thumbnail attached
					if (typeof quizSolution.answers[quizSolution.id].thumbnail === 'undefined') {
						console.log('Thumbnail not found');

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
				})
				.catch(error => {
					console.log('Unable to generate quiz data: ' + error);
					reject(error);
				});
		});
	}

	/**
	 * Check a given answer for correctness.
	 * @param {*} id ID of the solution (=Id of the button), to check the answer for validity
	 */
	checkSolution(id) {
		//change the color of the pressed button depending on the answers and count / reset the points
		if (id === this.state.quizSolution.id) {
			//automatically load a new round after 3 seconds
			setTimeout(() => {
				this.newRound();
			}, 3000);

			this.setState({
				//dynamic generation of the button style names
				['button' + id + '_style']: styles.buttonStyle_success,
				points: this.state.points + 1,
			});
		} else {
			this.setState({
				['button' + id + '_style']: styles.buttonStyle_error,
				points: 0,
			});
		}
	}

	/**
	 * Provides a hint of the correct answer at the cost of a point.
	 */
	hint() {
		alert('Hint: ' + this.state.quizSolution.answers[this.state.quizSolution.id].instructions);
		this.setState({
			points: this.state.points - 1,
		});
	}

	/**
	 * Joker for t he quiz. Randomly disables one possible answer and decreases
	 * the point count by 2.
	 */
	joker() {
		//Store the old array of already disabled buttons
		let disabledButtonIDsCopy = this.state.disabled_buttonIds.slice();

		//Array of all possible buttons that can be disabled
		let buttonIdRange = [0, 1, 2, 3];

		//Array of buttons that are already disabled or are the correct solution
		var unavailableIds = this.state.disabled_buttonIds.slice();
		unavailableIds.push(this.state.quizSolution.id);

		//Array of remaining IDs that represent disableable buttons
		let remainingIds = buttonIdRange.filter(x => !unavailableIds.includes(x));

		//Only allow the use of the joker, if there are still wrong answers to eliminate
		if (remainingIds.length >= 1) {
			//randomly disable one wrong answer
			let disable_id = remainingIds[Math.floor(Math.random() * remainingIds.length)];

			//store that this button has been disabled
			disabledButtonIDsCopy.push(disable_id);

			this.setState({
				['button' + disable_id + '_style']: styles.buttonStyle_disabled,
				['button' + disable_id + '_disabled']: true,
				disabled_buttonIds: disabledButtonIDsCopy,
				points: this.state.points - 2,
			});
		}
	}

	renderWelcomePage() {
		return (
			<View style={styles.container}>
				<Button title={'new'} onPress={() => this.newGame()} />
				<Text>{this.state.error}</Text>
			</View>
		);
	}

	renderGamePage() {
		return (
			<View style={{ height: '100%' }}>
				<Grid>
					<Row size={15}>
						<Col>
							<Button title={'New'} onPress={() => this.newGame()} />
						</Col>
						<Col>
							<Button title={'Joker'} onPress={() => this.joker()} />
						</Col>
						<Col>
							<Button title={'Hint'} onPress={() => this.hint()} />
						</Col>
						<Col>
							<Text>{this.state.points}</Text>
						</Col>
					</Row>
					<Row size={50}>
						<Image
							style={styles.image}
							source={{ uri: this.state.quizSolution.answers[this.state.quizSolution.id].thumbnail }}
						/>
					</Row>
					<Row size={35}>
						<Row>
							<Col>
								<Button
									title={this.state.quizSolution.answers[0].name}
									buttonStyle={this.state.button0_style}
									disabled={this.state.button0_disabled}
									onPress={() => this.checkSolution(0)}
								/>
							</Col>
							<Col>
								<Button
									title={this.state.quizSolution.answers[1].name}
									buttonStyle={this.state.button1_style}
									disabled={this.state.button1_disabled}
									onPress={() => this.checkSolution(1)}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<Button
									title={this.state.quizSolution.answers[2].name}
									buttonStyle={this.state.button2_style}
									disabled={this.state.button2_disabled}
									onPress={() => this.checkSolution(2)}
								/>
							</Col>
							<Col>
								<Button
									title={this.state.quizSolution.answers[3].name}
									buttonStyle={this.state.button3_style}
									disabled={this.state.button3_disabled}
									onPress={() => this.checkSolution(3)}
								/>
							</Col>
						</Row>
					</Row>
				</Grid>
			</View>
		);
	}

	render() {
		console.log(this.state.quizSolution);

		if (this.state.displayGameData) {
			return this.renderGamePage();
		} else {
			return this.renderWelcomePage();
		}
	}

	renderWithTraditionalFlex() {
		console.log(this.state.quizSolution);

		if (this.state.displayGameData) {
			return (
				<View style={styles.container}>
					{/* <ImageBackground
						source={require('../../assets/images/MaexleBackground2.jpg')}
						style={{ width: '100%', height: '100%' }}
					/> */}

					<View style={styles.topbar}>
						<View style={styles.topbarElement}>
							<Button title={'New'} onPress={() => this.newGame()} />
						</View>
						<View style={styles.topbarElement}>
							<Button title={'Joker'} onPress={() => this.joker()} />
						</View>
						<View style={styles.topbarElement}>
							<Button title={'Hint'} onPress={() => this.hint()} />
						</View>
						<View style={styles.topbarElement}>
							<Text>{this.state.points}</Text>
						</View>
					</View>

					<View
						visible={this.state.visible}
						style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 5 }}
					>
						<View style={{ flex: 3, margin: 5 }}>
							<Image
								style={styles.image}
								source={{ uri: this.state.quizSolution.answers[this.state.quizSolution.id].thumbnail }}
							/>
						</View>

						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
							<View>
								<Button
									title={this.state.quizSolution.answers[0].name}
									buttonStyle={this.state.button0_style}
									disabled={this.state.button0_disabled}
									onPress={() => this.checkSolution(0)}
								/>
							</View>
							<View>
								<Button
									title={this.state.quizSolution.answers[1].name}
									buttonStyle={this.state.button1_style}
									disabled={this.state.button1_disabled}
									onPress={() => this.checkSolution(1)}
								/>
							</View>
						</View>

						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
							<View>
								<Button
									title={this.state.quizSolution.answers[2].name}
									buttonStyle={this.state.button2_style}
									disabled={this.state.button2_disabled}
									onPress={() => this.checkSolution(2)}
								/>
							</View>
							<View>
								<Button
									title={this.state.quizSolution.answers[3].name}
									buttonStyle={this.state.button3_style}
									disabled={this.state.button3_disabled}
									onPress={() => this.checkSolution(3)}
								/>
							</View>
						</View>
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
		flexDirection: 'column',
		paddingTop: 30,
		backgroundColor: '#ffd',
	},
	topbar: {
		flex: 1,
		height: 30,
		flexDirection: 'row',
	},
	topbarElement: {
		flex: 1,
		margin: 1,
	},
	buttonStyle_normal: {
		backgroundColor: 'rgba(92, 99,216, 1)',
		borderColor: 'transparent',
		height: 30,
		width: '40%',
		margin: 2,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_success: {
		backgroundColor: 'rgba(130, 250, 100, 1)',
		borderColor: 'transparent',
		height: 30,
		width: '40%',
		margin: 2,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_error: {
		backgroundColor: 'rgba(210, 50, 50, 1)',
		borderColor: 'transparent',
		height: 30,
		width: '40%',
		margin: 2,
		borderWidth: 0,
		borderRadius: 15,
	},
	buttonStyle_disabled: {
		backgroundColor: 'rgba(200, 200, 200, 1)',
		borderColor: 'transparent',
		height: 30,
		width: '40%',
		margin: 2,
		borderWidth: 0,
		borderRadius: 15,
	},
	image: {
		width: 180,
		height: 180,
		alignSelf: 'center',
		margin: 10,
	},
});
