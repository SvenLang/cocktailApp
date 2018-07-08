import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";

import CocktailCard from "../components/CocktailCard";

const allDrinks = require("../assets/drinks/all-drinks.json");

export default class CocktailList extends React.Component {
  state = {};

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <FlatList
            data={allDrinks}
            renderItem={({ item }) => (
              <CocktailCard
                name={item.strDrink}
                pic={item.strDrinkThumb}
                alc={item.strAlcoholic}
                category={item.strCategory}
                glass={item.strGlass}
                ingredients={[
                  {
                    ingredient: item.strIngredient1,
                    measure: item.strMeasure1
                  },
                  {
                    ingredient: item.strIngredient2,
                    measure: item.strMeasure2
                  },
                  {
                    ingredient: item.strIngredient3,
                    measure: item.strMeasure3
                  },
                  {
                    ingredient: item.strIngredient4,
                    measure: item.strMeasure4
                  },
                  {
                    ingredient: item.strIngredient5,
                    measure: item.strMeasure5
                  },
                  {
                    ingredient: item.strIngredient6,
                    measure: item.strMeasure6
                  },
                  {
                    ingredient: item.strIngredient7,
                    measure: item.strMeasure7
                  },
                  {
                    ingredient: item.strIngredient8,
                    measure: item.strMeasure8
                  },
                  {
                    ingredient: item.strIngredient9,
                    measure: item.strMeasure9
                  },
                  {
                    ingredient: item.strIngredient10,
                    measure: item.strMeasure10
                  },
                  {
                    ingredient: item.strIngredient11,
                    measure: item.strMeasure11
                  },
                  {
                    ingredient: item.strIngredient12,
                    measure: item.strMeasure12
                  },
                  {
                    ingredient: item.strIngredient13,
                    measure: item.strMeasure13
                  },
                  {
                    ingredient: item.strIngredient14,
                    measure: item.strMeasure14
                  },
                  {
                    ingredient: item.strIngredient15,
                    measure: item.strMeasure15
                  }
                ]}
                instructions={item.strInstructions}
              />
            )}
          />
          <Text>{allDrinks[0].strDrink}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
