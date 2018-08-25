import React from "react";
import { StyleSheet, View } from "react-native";
import { getFavDrinks } from "../assets/drinks/DrinksInterface";
import BasicCocktailList from "../components/BasicCocktailList";

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
    getFavDrinks();
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    //This codeblock must load the favorite cocktails data

    getFavDrinks()
      .then(drinks => {
        this.setState({ loading: false, favoriteDrinks: drinks });
      })

      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  render() {
    getFavDrinks();
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
