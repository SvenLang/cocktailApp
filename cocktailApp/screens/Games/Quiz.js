import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Button, Icon, Left, Body, Text, Card, CardItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Font } from 'expo';
import { getRandomDrink } from '../../assets/drinks/DrinksInterface';

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
			loading: true,
		};
	}

	async componentWillMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
		});
		this.setState({ loading: false });
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
				var promise = getRandomDrink('js')
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
				points: this.state.points + 3,
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
		alert(this.state.quizSolution.answers[this.state.quizSolution.id].instructions);

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

	/**
	 * Display this page before the first Game is started.
	 * It shortly explains the rules and then a game can be started
	 */
	renderWelcomePage() {
		return (
			<View style={{ height: '100%' }}>
				<Container style={styles.container}>
					<Button iconLeft full onPress={() => this.newGame()}>
						<Icon name="md-refresh" />
						<Text>New</Text>
					</Button>
					<Card style={styles.cardStyle}>
						<CardItem header bordered>
							<Text>Cocktail Quiz</Text>
						</CardItem>
						<CardItem>
							<Text>
								This is a cocktail guessing game. You will see images of cocktails and 4 possible
								answers. Each correct answer is worth 3 points. There are two different means of help.
							</Text>
						</CardItem>
						<CardItem>
							<Text>
								Joker: Using the joker will disable one random wrong answer at the cost of 2 points.
							</Text>
						</CardItem>
						<CardItem>
							<Text>
								Hint: The hint will display the mixing instructions of the displayed cocktail at the
								cost of 2 points.
							</Text>
						</CardItem>
					</Card>
				</Container>
			</View>
		);
	}

	/**
	 * Game data has been created, so display the real quiz screen
	 */
	renderGamePage() {
		return (
			<View style={{ height: '100%' }}>
				<Container style={styles.container}>
					<Content padder>
						<Grid>
							<Row>
								<Button iconLeft primary style={styles.topButtonStyle} onPress={() => this.newGame()}>
									<Icon name="md-refresh" />
									<Text>New</Text>
								</Button>
								<Button iconLeft primary style={styles.topButtonStyle} onPress={() => this.joker()}>
									<Icon name="heart" />
									<Text>Joker</Text>
								</Button>
								<Button iconLeft primary style={styles.topButtonStyle} onPress={() => this.hint()}>
									<Icon name="help" />
									<Text>Hint</Text>
								</Button>
								<Button disabled primary style={styles.topButtonStyle}>
									<Text>{this.state.points}</Text>
								</Button>
							</Row>
							<Row>
								<Body>
									<Card style={styles.cardStyle}>
										<CardItem bordered>
											<Left>
												<Icon name="md-wine" />
												<Body>
													<Text>Cocktail-Quiz</Text>
													<Text note>Which cocktail is displayed below?</Text>
												</Body>
											</Left>
										</CardItem>
										<CardItem cardBody bordered>
											<Image
												style={styles.cocktailImage}
												source={{
													uri: this.state.quizSolution.answers[this.state.quizSolution.id]
														.thumbnail,
												}}
											/>
										</CardItem>
										<CardItem bordered>
											<Grid>
												<Row>
													<Col style={styles.quizButtonCol}>
														<Button
															rounded
															style={this.state.button0_style}
															disabled={this.state.button0_disabled}
															onPress={() => this.checkSolution(0)}
														>
															<Text>{this.state.quizSolution.answers[0].name}</Text>
														</Button>
													</Col>
													<Col style={styles.quizButtonCol}>
														<Button
															rounded
															style={this.state.button1_style}
															disabled={this.state.button1_disabled}
															onPress={() => this.checkSolution(1)}
														>
															<Text>{this.state.quizSolution.answers[1].name}</Text>
														</Button>
													</Col>
												</Row>
												<Row>
													<Col style={styles.quizButtonCol}>
														<Button
															rounded
															style={this.state.button2_style}
															disabled={this.state.button2_disabled}
															onPress={() => this.checkSolution(2)}
														>
															<Text>{this.state.quizSolution.answers[2].name}</Text>
														</Button>
													</Col>
													<Col style={styles.quizButtonCol}>
														<Button
															rounded
															style={this.state.button3_style}
															disabled={this.state.button3_disabled}
															onPress={() => this.checkSolution(3)}
														>
															<Text>{this.state.quizSolution.answers[3].name}</Text>
														</Button>
													</Col>
												</Row>
											</Grid>
										</CardItem>
									</Card>
								</Body>
							</Row>
						</Grid>
					</Content>
				</Container>
			</View>
		);
	}

	/**
	 * Render function that calls different rendering depending on the state
	 * of the font being loaded and the game data.
	 */
	render() {
		if (this.state.loading) {
			return <View />;
		} else {
			if (this.state.displayGameData) {
				return this.renderGamePage();
			} else {
				return this.renderWelcomePage();
			}
		}
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(230,250,250,1)',
		alignContent: 'center',
		alignItems: 'center',
	},
	buttonStyle_normal: {
		backgroundColor: 'rgba(92, 99,216, 1)',
		borderColor: 'transparent',
		width: '95%',
	},
	buttonStyle_success: {
		backgroundColor: 'rgba(130, 250, 100, 1)',
		borderColor: 'transparent',
		width: '95%',
	},
	buttonStyle_error: {
		backgroundColor: 'rgba(210, 50, 50, 1)',
		borderColor: 'transparent',
		width: '95%',
	},
	buttonStyle_disabled: {
		backgroundColor: 'rgba(200, 200, 200, 1)',
		borderColor: 'transparent',
		width: '95%',
	},
	cocktailImage: {
		width: 200,
		height: 200,
		margin: 5,
	},
	quizButtonCol: {
		margin: 2,
	},
	cardStyle: {
		width: '95%',
		alignItems: 'center',
	},
	topButtonStyle: {
		borderRadius: 5,
	},
});
