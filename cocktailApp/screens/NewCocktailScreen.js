import React from 'react';
import { StyleSheet, ScrollView, View, Image, KeyboardAvoidingView, ListView } from 'react-native';
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
import { Font } from 'expo';
import { getGlasses, getCategories } from '../assets/drinks/DrinksInterface';

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
		let allGlasses = getGlasses();
		let allCategories = getCategories();
		this.state = {
			category: undefined,
			glass: undefined,
			alcoholic: false,
			drinkThumb: undefined,
			ingredients: [],
			instructions: undefined,
			loading: true,
			nameIconVisible: false,
			allGlasses: allGlasses,
			allCategories: allCategories,
		};
	}

	/********************************************
	 * Operations that modify what is displayed
	 ********************************************/

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

	/**
	 * Automatically build as many rows for adding ingredients and measures as was requested
	 * Content is retrieved from the state.ingredients array.
	 */
	createIngredientRow() {
		const rows = this.state.ingredients.map((obj, i) => {
			return (
				<Row key={'r' + i}>
					<Col key={'ci' + i} size={6}>
						<Item floatingLabel key={'iti' + i}>
							<Label key={'li' + i}>
								Ingredient
								{i}
							</Label>
							<Input
								value={obj.ingredient}
								key={'ii' + i}
								onChangeText={this.saveIngredient.bind(this, obj.key)}
							/>
						</Item>
					</Col>
					<Col key={'cm' + i} size={4}>
						<Item floatingLabel key={'itm' + i}>
							<Label key={'lm' + i}>
								Measure
								{i}
							</Label>
							<Input
								value={obj.measure}
								key={'im' + i}
								onChangeText={this.saveMeasure.bind(this, obj.key)}
							/>
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

	/********************************************
	 * Operations that handle input content
	 ********************************************/

	saveIngredient(key, value) {
		//find the index where the object.key is stored and modify the ingredient
		var objIndex = this.state.ingredients.findIndex(obj => obj.key === key);
		this.state.ingredients[objIndex].ingredient = value;
		this.setState({
			ingredients: this.state.ingredients,
		});
	}

	saveMeasure(key, value) {
		//find the index where the object.key is stored and modify the measure
		var objIndex = this.state.ingredients.findIndex(obj => obj.key === key);
		this.state.ingredients[objIndex].measure = value;
		this.setState({
			ingredients: this.state.ingredients,
		});
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
	 * Save the entered URL/path to the image of the cocktail
	 * @param {*} value URI to the cocktails image
	 */
	saveDrinkThumb(value) {
		this.setState({ drinkThumb: value });
	}

	/**
	 * Save the provided instructions for a new cocktail
	 * @param {*} value instruction text
	 */
	saveInstructions(value) {
		this.setState({ instructions: value });
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
				<KeyboardAvoidingView
					style={{ backgroundColor: 'rgba(230,250,250,1)', height: '100%' }}
					behavior="padding"
				>
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
															<Input disabled placeholder="Alcoholic" />
														</Item>
													</Col>
													<Col style={{ alignItems: 'flex-end', alignContent: 'center' }}>
														<ListItem
															onPress={() =>
																this.setState({ alcoholic: !this.state.alcoholic })
															}
														>
															<CheckBox
																checked={this.state.alcoholic}
																style={{
																	alignSelf: 'flex-end',
																	marginRight: 0,
																	marginLeft: 1,
																}}
																onPress={() =>
																	this.setState({ alcoholic: !this.state.alcoholic })
																}
															/>
														</ListItem>
													</Col>
												</Row>
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
																{this.createDropdown(this.state.allCategories)}
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
																{this.createDropdown(this.state.allGlasses)}
															</Picker>
														</Item>
													</Col>
												</Row>

												<Row>
													<Col>
														<H2>
															{'\n'}
															Ingredients:
														</H2>
													</Col>
													<Col>
														<Right>
															<Button
																iconLeft
																full
																style={{
																	alignSelf: 'flex-end',
																	height: '80%',
																	marginTop: 7,
																	marginLeft: 50,
																	marginRight: 0,
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
											<Textarea
												rowSpan={3}
												bordered
												placeholder="Instructions"
												onChangeText={this.saveInstructions.bind(this)}
											/>
										</Form>
										<Button primary iconLeft full style={{ marginTop: 10 }}>
											<Icon name="md-checkmark-circle" />
											<Text>Save Cocktail</Text>
										</Button>
									</Body>
								</CardItem>
							</Card>
						</Content>
					</Container>
				</KeyboardAvoidingView>
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
		backgroundColor: 'rgba(230,250,250,1)',
	},
});
