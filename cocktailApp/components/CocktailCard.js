import React from 'react';
import { Image, StyleSheet, Text, Modal, FlatList, View, ImageBackground, ScrollView } from 'react-native';

import { Card, Button, Rating, ListItem } from 'react-native-elements';

export default class CocktailCard extends React.Component {
	constructor(props) {
		super(props);
	}

	ratingCompleted(rating) {
		console.log(rating);
	}

	render() {
		//If no Cocktail was defined from CocktailList.js then the CocktailCard shows nothing.
		//This situation occurs when the app starts.
		if (this.props.cocktailToShow === undefined) {
			return null;
		}
		return (
			<ScrollView>
				<ImageBackground
					source={require('../assets/images/tropicalBackground.jpg')}
					style={{ width: '100%', height: '100%' }}
				>
					<Card title={this.props.cocktailToShow.name} containerStyle={styles.card}>
						<Rating
							showRating
							type="star"
							fractions={0}
							startingValue={this.props.cocktailToShow.rating}
							imageSize={20}
							onFinishRating={this.ratingCompleted}
							style={styles.rating}
						/>
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
								/>
							)}
							keyExtractor={item => item.ingredient}
						/>
						<Text>Instructions:</Text>
						<Text>{this.props.cocktailToShow.instructions}</Text>
					</Card>
				</ImageBackground>
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
	card: {},
	image: {
		width: 180,
		height: 180,
		alignSelf: 'center',
		marginBottom: 10,
	},
});
