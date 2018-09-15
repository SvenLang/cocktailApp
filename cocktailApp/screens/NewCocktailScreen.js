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
import { getGlasses, getCategories, insertNewCocktail } from '../assets/drinks/DrinksInterface';
import CameraModal from '../components/CameraModal';
import Images from '@assets/images';

let ingredientsArrayKey = 1;
let allGlasses = getGlasses();
let allCategories = getCategories();

export default class NewCockailScreen extends React.Component {
	static navigationOptions = {
		title: 'Add A New Cocktail',
	};

	resetStateToDefaults() {
		this.setState({
			name: '',
			category: '',
			glass: '',
			alcoholic: false,
			drinkThumb: '',
			ingredients: [{ key: 0, ingredient: '', measure: '' }],
			instructions: '',
			allGlasses: allGlasses,
			allCategories: allCategories,
			showCamera: false,
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			category: '',
			glass: '',
			alcoholic: false,
			drinkThumb: '',
			ingredients: [{ key: 0, ingredient: '', measure: '' }],
			instructions: '',
			allGlasses: allGlasses,
			allCategories: allCategories,
			showCamera: false,
		};
	}

	/********************************************
	 * Operations for the dropdowns
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

	/********************************************
	 * Operations for ingredients
	 ********************************************/

	/**
	 * Add another row to add an ingredient for a cocktail
	 */
	addIngredientRows() {
		// Add on object identified by key, so it can be found later if an item with a lower index was already deleted!
		// For the same reason the ingredientsArrayKey counter is only increased!
		this.state.ingredients.push({ key: ingredientsArrayKey++, ingredient: '', measure: '' });
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
	 * As ingredient and measure are entered in two separate field, they need to be mapped using the key
	 * Only the whole array can be replaced in setState, so on the local array changes are performed
	 * before the local copy is assigned again.
	 * @param {*} key identifier of the selected row
	 * @param {*} value entered ingredient
	 */
	saveIngredient(key, value) {
		//find the index where the object.key is stored and modify the ingredient
		var objIndex = this.state.ingredients.findIndex(obj => obj.key === key);
		this.state.ingredients[objIndex].ingredient = value;
		this.setState({
			ingredients: this.state.ingredients,
		});
	}

	/**
	 * Map the measure to its ingredient by key.
	 * @param {*} key identifier of the selected row
	 * @param {*} value entered measure
	 */
	saveMeasure(key, value) {
		//find the index where the object.key is stored and modify the measure
		var objIndex = this.state.ingredients.findIndex(obj => obj.key === key);
		this.state.ingredients[objIndex].measure = value;
		this.setState({
			ingredients: this.state.ingredients,
		});
	}

	/**
	 * Automatically build as many rows for adding ingredients and measures as were requested
	 * Content is retrieved from the state.ingredients array.
	 */
	displayIngredientRows() {
		//each item is prepared with a unique key, otherwise a warning is thrown
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
	 * Operations for submitting
	 ********************************************/

	/**
	 * Return a boolean, if the submit button can be displayed (=true).
	 */
	canSubmitBeDisplayed() {
		const { name, category, glass, instructions, ingredients } = this.state;
		return (
			name.length > 0 &&
			category.length > 0 &&
			glass.length > 0 &&
			instructions.length > 0 &&
			ingredients.length > 0 &&
			ingredients[0].ingredient.length > 0 &&
			ingredients[0].measure.length > 0
		);
	}

	submitNewCocktail() {
		var imageURI = this.state.drinkThumb.length > 0 ? this.state.drinkThumb : Images.cubeUnmarked;
		var alcoholic = this.state.alcoholic ? 'Alcoholic' : 'Non alcoholic';
		dateModified = new Date().toString();

		//use unknown dice image for unknown URI!
		let cocktail = {
			name: this.state.name,
			category: this.state.category,
			glass: this.state.glass,
			alcoholic: alcoholic,
			drinkThumb: imageURI,
			ingredients: this.state.ingredients,
			instructions: this.state.instructions,
			rating: 0,
			dateModified: dateModified,
		};

		console.log('Cocktail to be created' + JSON.stringify(cocktail));

		var success = insertNewCocktail('js', cocktail);
		if (success) {
			alert('Cocktail has been added successfully!');
			this.resetStateToDefaults();
		} else {
			alert('Something went wrong, please try again');
		}
	}

	showPictureUri(uri) {
		this.setState({
			drinkThumb: uri,
			showCamera: false,
		});
	}

	/**
	 * Example Cocktail object
	 * {
	 * name: "'57 Chevy with a White License Plate",
	 * category: "Cocktail",
	 * glass: "Highball glass",
	 * dateModified: "2016-07-18 22:49:04",
	 * alcoholic: "Alcoholic",
	 * drinkThumb:
	 *   "http://www.thecocktaildb.com/images/media/drink/qyyvtu1468878544.jpg",
	 * ingredients: [
	 *   { ingredient: "Creme de Cacao", measure: "1 oz white" },
	 *   { ingredient: "Vodka", measure: "1 oz" }
	 * ],
	 * instructions:
	 *   "1. Fill a rocks glass with ice 2.add white creme de cacao and vodka 3.stir",
	 * rating: 5
	 * },
	 *
	 *****************************/

	render() {
		console.log('items in state: ' + JSON.stringify(this.state));
		let isSubmitEnabled = this.canSubmitBeDisplayed();

		return (
			<KeyboardAvoidingView style={{ height: '100%' }} behavior="padding">
				<Container style={{ backgroundColor: 'rgba(230,250,250,1)' }}>
					<Content padder>
						<CameraModal
							visible={this.state.showCamera}
							onRequestClose={() => this.setState({ showCamera: false })}
							onPressDone={uri => this.showPictureUri(uri)}
						/>

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
												<Input
													value={this.state.name}
													onChangeText={value => this.setState({ name: value })}
												/>
											</Item>
											<Row>
												<Col size={4}>
													<Item floatingLabel>
														<Label>Picture</Label>
														<Input
															value={this.state.drinkThumb}
															onChangeText={value => this.setState({ drinkThumb: value })}
														/>
													</Item>
												</Col>
												<Col size={1}>
													<Button
														primary
														block
														icon
														onPress={() => this.setState({ showCamera: true })}
														style={{
															alignSelf: 'flex-end',
															height: '80%',
															marginTop: 7,
															marginRight: 0,
														}}
													>
														<Icon name="md-camera" />
													</Button>
												</Col>
											</Row>

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
															onValueChange={value => this.setState({ category: value })}
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
															onValueChange={value => this.setState({ glass: value })}
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
															<Text>Add</Text>
														</Button>
													</Right>
												</Col>
											</Row>
											{this.displayIngredientRows()}
										</Grid>
										<Textarea
											rowSpan={3}
											bordered
											placeholder="Instructions"
											value={this.state.instructions}
											onChangeText={value => this.setState({ instructions: value })}
										/>
									</Form>
									<Button
										primary
										iconLeft
										full
										style={{ marginTop: 10 }}
										disabled={!isSubmitEnabled}
										onPress={() => this.submitNewCocktail()}
									>
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
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		backgroundColor: 'rgba(230,250,250,1)',
	},
});
