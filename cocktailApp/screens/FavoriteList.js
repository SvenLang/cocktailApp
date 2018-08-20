import React from "react";
import { StyleSheet, View } from "react-native";
import { getFavDrinks } from "../assets/drinks/DrinksInterface";
import BasicCocktailList from "../components/BasicCocktailList";
import Store from "../Firebase/Store";

export default class FavoriteList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showCocktailCardModalVisible: false,
      favoriteDrinks: [],
      clickedCocktail: undefined,
      error: null
    };
  }

  componentDidMount() {
    this.loadFavouriteDrinks();
  }

  loadFavouriteDrinks = async () => {
    const favoriteDrinks = await Store.getFavouriteDrinks();
    this.setState({ favoriteDrinks: favoriteDrinks });
  };

  render() {
    return (
      <View>
        <BasicCocktailList
          drinks={this.state.favoriteDrinks}
          showSearchBar={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  rating: {
    position: "absolute",
    top: 35,
    right: 55
  }
});
