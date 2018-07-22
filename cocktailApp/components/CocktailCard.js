import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  View,
  TouchableOpacity
} from "react-native";

import { Card, Button, Rating } from "react-native-elements";

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
      <View>
        <Modal
          visible={this.props.visible}
          onRequestClose={this.props.onRequestClose}
          transparent={true}
          animationType={"fade"}
        >
          <Card title={this.props.cocktailToShow.name}>
            <Rating
              showRating
              type="star"
              fractions={0}
              startingValue={this.props.cocktailToShow.rating}
              imageSize={20}
              onFinishRating={this.ratingCompleted}
              style={{
                paddingVertical: 0,
                alignItems: "center",
                marginBottom: 10
              }}
            />
            <Image
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginBottom: 10
              }}
              source={{
                uri: this.props.cocktailToShow.drinkThumb
              }}
            />
            <Text>Kategorie: {this.props.cocktailToShow.category} </Text>
            <Text>Glas: {this.props.cocktailToShow.glass} </Text>
            <Text>Zutaten:</Text>
            <FlatList
              data={this.props.cocktailToShow.ingredients}
              renderItem={({ item }) => (
                <Text>
                  {item.ingredient} {item.measure}
                </Text>
              )}
              keyExtractor={item => item.ingredient}
            />
            <Text>Zubereitung:</Text>
            <Text>{this.props.cocktailToShow.instructions}</Text>
            <Button
              icon={{
                name: "close",
                size: 20,
                color: "black"
              }}
              buttonStyle={styles.buttonCloseStyle}
              onPress={this.props.onRequestClose}
            />
          </Card>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  },
  buttonCloseStyle: {
    backgroundColor: "transparent"
  }
});
