import React from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
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
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Font } from 'expo';

const dummyData = {
	categories: ['Cocktail', 'Shot', 'Beer'],
	glasses: ['Old-fashioned glass', 'Beer Glass', 'White wine glass'],
};

let ingredientsArrayKey = 0;

export default class NewCockailScreen extends React.Component {
	static navigationOptions = {
		title: 'Add A New Cocktail',
	};

	async componentWillMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
		});
		this.setState({ loading: false });
	}

	constructor(props) {
		super(props);
		this.state = {
			category: undefined,
			glass: undefined,
			alcoholic: undefined,
			drinkThumb: undefined,
			ingredients: [],
			instructions: undefined,
			loading: true,
			nameIconVisible: false,
		};
	}

	/**
	 * Dynamically create the options for dropdown menues
	 * @param {*} items An array of items that shall be selectable via dropdown
	 */
	createDropdown(items) {
		const options = items.map((item, i) => {
			return <Picker.Item key={i} label={item} value={item} />;
		});
		return options;
	}

	/**
	 * Add another row to add an ingredient for a cocktail
	 */
	addIngredientRows() {
		// Add on object identified by key, so it can be found later if an item with a lower index was already deleted!
		// For the same reason the ingredientsArrayKey counter is only increased!
		this.state.ingredients.push({ key: ingredientsArrayKey++ });
		this.setState({ ingredients: this.state.ingredients });
	}

	/**
	 * The ingredient identified by key was removed, so the complete object should be removed from the array
	 * @param {*} key Identifies the clicked row in the list of the ingredients
	 */
	removeIngredientRow(key) {
		//find the entry matching the key and remove the object from the array
		this.state.ingredients.some((item, index) => {
			if (this.state.ingredients[index].key === key) {
				this.state.ingredients.splice(index, 1);
			}
		});

		this.setState({
			ingredients: this.state.ingredients,
		});
	}

	createIngredientRow() {
		const rows = this.state.ingredients.map((obj, i) => {
			return (
				<Row key={'r' + i}>
					<Col key={'ci' + i} size={6}>
						<Item floatingLabel key={'iti' + i}>
							<Label key={'li' + i}>Ingredient</Label>
							<Input value={obj.ingredient} key={'ii' + i} />
						</Item>
					</Col>
					<Col key={'cm' + i} size={4}>
						<Item floatingLabel key={'itm' + i}>
							<Label key={'lm' + i}>Measure</Label>
							<Input value={obj.measure} key={'im' + i} />
						</Item>
					</Col>
					<Col key={'cb' + i} size={1}>
						<Icon
							key={'ic' + i}
							name="md-close"
							onPress={() => this.removeIngredientRow(obj.key)}
							style={{ marginTop: 30 }}
						/>
					</Col>
				</Row>
			);
		});
		return rows;
	}

	/**
	 * Save the entered name of the Cocktail
	 * @param {*} value Enterned name of the cocktail
	 */
	saveName(value) {
		this.setState({ name: value });
	}

	/**
	 * Save the selected category from the available options
	 * @param {*} value Selected category
	 */
	pickCategory(value) {
		console.log('Picked category:' + value);
		this.setState({
			category: value,
		});
	}

	/**
	 * Save the selected glass type from the available options
	 * @param {*} value Selected glass type
	 */
	pickGlass(value) {
		console.log('Picked glass:' + value);
		this.setState({
			glass: value,
		});
	}

	/**
	 * Save the enterd URL/path to the image of the cocktail
	 * @param {*} value URI to the cocktails image
	 */
	saveDrinkThumb(value) {
		this.setState({ drinkThumb: value });
	}

	/**
	 * Example Cocktail object
	 * {
	 * key: 0,
	 * name: "'57 Chevy with a White License Plate",
	 * category: "Cocktail",
	 * glass: "Highball glass",
	 * dateModified: "2016-07-18 22:49:04",
	 * idDrink: 14029,
	 * alcoholic: "Alcoholic",
	 * drinkThumb:
	 *   "http://www.thecocktaildb.com/images/media/drink/qyyvtu1468878544.jpg",
	 * iba: "",
	 * ingredients: [
	 *   { ingredient: "Creme de Cacao", measure: "1 oz white" },
	 *   { ingredient: "Vodka", measure: "1 oz" }
	 * ],
	 * instructions:
	 *   "1. Fill a rocks glass with ice 2.add white creme de cacao and vodka 3.stir",
	 * video: "",
	 * rating: 5
	 * },
	 *
	 *****************************/

	render() {
		console.log('items in state: ' + JSON.stringify(this.state));

		if (this.state.loading === false) {
			return (
				<ScrollView style={styles.container}>
					<Container>
						<Content padder>
							<Card
								style={{
									width: '95%',
									alignItems: 'center',
									alignContent: 'center',
									alignSelf: 'center',
								}}
							>
								<CardItem>
									<Body>
										<Form style={{ alignSelf: 'stretch' }}>
											<Grid>
												<Item floatingLabel>
													<Label>Cocktail Name</Label>
													<Input onChangeText={this.saveName.bind(this)} />
												</Item>
												<Item floatingLabel>
													<Label>Picture</Label>
													<Input onValueChange={this.saveDrinkThumb.bind(this)} />
												</Item>
												<Row>
													<Col size={4}>
														<Item disabled>
															<Input disabled placeholder="Category: " />
														</Item>
													</Col>
													<Col size={6}>
														<Item picker>
															<Picker
																iosHeader="Select a category"
																mode="dropdown"
																style={{ width: undefined }}
																placeholder="Select a category"
																placeholderStyle={{ color: '#2874F0' }}
																selectedValue={this.state.category}
																onValueChange={this.pickCategory.bind(this)}
															>
																<Picker.Item label="Select Category" value={null} />
																{this.createDropdown(dummyData.categories)}
															</Picker>
														</Item>
													</Col>
												</Row>
												<Row>
													<Col size={4}>
														<Item disabled>
															<Input disabled placeholder="Glass: " />
														</Item>
													</Col>
													<Col size={6}>
														<Item picker>
															<Picker
																iosHeader="Select a glass"
																mode="dropdown"
																style={{ width: undefined }}
																placeholder="Select a glass"
																placeholderStyle={{ color: '#2874F0' }}
																selectedValue={this.state.glass}
																onValueChange={this.pickGlass.bind(this)}
															>
																<Picker.Item label="Select Glass" value={null} />
																{this.createDropdown(dummyData.glasses)}
															</Picker>
														</Item>
													</Col>
												</Row>

												<Row>
													<Col>
														<Text>
															{'\n'}
															Ingredients:
														</Text>
													</Col>
													<Col>
														<Right>
															<Button
																iconLeft
																block
																style={{
																	alignContent: 'center',
																	alignItems: 'center',
																	height: '80%',
																	marginTop: 5,
																}}
																onPress={() => this.addIngredientRows()}
															>
																<Icon name="md-add" />
																<Text>New</Text>
															</Button>
														</Right>
													</Col>
												</Row>
												{this.createIngredientRow()}
											</Grid>
										</Form>
									</Body>
								</CardItem>
							</Card>
						</Content>
					</Container>
				</ScrollView>
			);
		} else {
			return <View />;
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		backgroundColor: '#fff',
	},
});
