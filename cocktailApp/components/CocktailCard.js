import React from 'react';
import { Image, StyleSheet, Text, FlatList, View, ScrollView, Share } from 'react-native';
import { Card, Button, Rating, ListItem, Icon } from 'react-native-elements';
/*
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
*/

export default class CocktailCard extends React.Component {
	constructor(props) {
		super(props);
	}

	/*
	renderNativeBase() {
		if (this.props.cocktailToShow === undefined) {
			return null;
		}
		return (
			<ScrollView style={{ height: '100%' }}>
				<Container style={{ width: '95%', alignItems: 'center' }}>
					<Content>
						<Card style={{ alignItems: 'center', alignSelf: 'center', margin: 10 }}>
							<CardItem bordered>
								<Left>
									<Icon name="md-wine" />
									<Body>
										<Text>{this.props.cocktailToShow.name}</Text>
									</Body>
								</Left>
							</CardItem>
							<CardItem bordered>
								<Left>
									<Rating
										showRating={false}
										type="star"
										fractions={0}
										startingValue={this.props.cocktailToShow.rating}
										imageSize={15}
										onFinishRating={this.props.ratingCompleted}
										style={styles.rating}
									/>
								</Left>
								<Right>
									<Button full primary>
										<Text>Share</Text>
									</Button>
								</Right>
							</CardItem>
							<CardItem>
								<Image
									style={styles.image}
									source={{
										uri: this.props.cocktailToShow.drinkThumb,
									}}
								/>
							</CardItem>
							<CardItem>
								<Text note>
									Category
									{'\n'}
								</Text>
								<Text>
									{this.props.cocktailToShow.category} {'\n'}
								</Text>
								<Text note>
									Glass
									{'\n'}
								</Text>
								<Text>
									{this.props.cocktailToShow.glass}
									{'\n'}
								</Text>
							</CardItem>
							<CardItem>
								<Text>Ingredients:</Text>
								<FlatList
									data={this.props.cocktailToShow.ingredients}
									renderItem={({ item }) => (
										<ListItem
											title={item.ingredient}
											rightTitle={item.measure}
											titleStyle={{ fontSize: 12 }}
											rightTitleStyle={{ fontSize: 12 }}
											hideChevron={true}
										/>
									)}
									keyExtractor={item => item.ingredient}
								/>
								<Text>Instructions:</Text>
								<Text>{this.props.cocktailToShow.instructions}</Text>
							</CardItem>
						</Card>
					</Content>
				</Container>
			</ScrollView>
		);
	}
  */

	shareCocktail() {
		console.log('Cocktail to be shared!');
		Share.share({
			title: 'Take a look a this',
			message: JSON.stringify(this.props.cocktailToShow),
		})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		//If no Cocktail was defined from CocktailList.js then the CocktailCard shows nothing.
		//This situation occurs when the app starts.
		if (this.props.cocktailToShow === undefined) {
			return null;
		}
		return (
			<ScrollView>
				<Card title={this.props.cocktailToShow.name} containerStyle={styles.card}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<Rating
							showRating
							type="star"
							fractions={0}
							startingValue={this.props.cocktailToShow.rating}
							imageSize={20}
							onFinishRating={this.props.ratingCompleted}
							style={styles.rating}
						/>
						<Icon name="share" raised color="#517fa4" onPress={() => this.shareCocktail()} />
					</View>
					<Image
						style={styles.image}
						source={{
							uri: this.props.cocktailToShow.drinkThumb,
						}}
					/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<Text>Category: {this.props.cocktailToShow.category} </Text>
						<Text>Glass: {this.props.cocktailToShow.glass} </Text>
					</View>
					<Text>Ingredients:</Text>
					<FlatList
						data={this.props.cocktailToShow.ingredients}
						renderItem={({ item }) => (
							<ListItem
								title={item.ingredient}
								rightTitle={item.measure}
								titleStyle={{ fontSize: 12 }}
								rightTitleStyle={{ fontSize: 12 }}
								hideChevron={true}
							/>
						)}
						keyExtractor={item => item.ingredient}
					/>
					<Text>Instructions:</Text>
					<Text>{this.props.cocktailToShow.instructions}</Text>
				</Card>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'lightgray',
	},
	buttonCloseStyle: {
		backgroundColor: 'transparent',
	},
	rating: {
		paddingVertical: 0,
		alignItems: 'center',
		marginBottom: 10,
	},
	card: {
		margin: 10,
	},
	image: {
		width: 180,
		height: 180,
		alignSelf: 'center',
		marginBottom: 10,
	},
});
