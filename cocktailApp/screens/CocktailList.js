import React from "react";
import { StyleSheet, View } from "react-native";
import { getDrinks } from "../assets/drinks/DrinksInterface";
import BasicCocktailList from "../components/BasicCocktailList";
import Store from "../Firebase/Store";
//import allDrinks from "../assets/drinks/allDrinks";

export default class CocktailList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadedAllDrinks: [],
      allDrinks: [],
      searchQuery: "",
      error: null,
      showSearchBar: this.props.showSearchBar
    };
  }

  static navigationOptions = {
    title: "Cocktails"
  };

  componentWillMount = async () => {
    //this.removeAllDrinks();
    //this.saveAllDrinks();
    this.loadAllDrinks();
    //this.makeRemoteRequest();
  };

  removeAllDrinks = async () => {
    await Store.deleteAllDrinks();
  };

  saveAllDrinks = async () => {
    await Store.saveAllDrinks(allDrinks);
  };

  loadAllDrinks = async () => {
    const allDrinks = await Store.loadAllDrinks();
    this.setState({ allDrinks: allDrinks, loadedAllDrinks: allDrinks });
  };

  searchForDrink = async () => {
    const allDrinks = await Store.searchForDrink(
      this.state.loadedAllDrinks,
      this.state.searchQuery
    );
    this.setState({ allDrinks: allDrinks });
  };

  makeRemoteRequest = () => {
    this.setState({ loading: true });

    getDrinks(30, this.state.searchQuery)
      .then(drinks => {
        this.setState({ loading: false, allDrinks: drinks });
      })
      .catch(error => {
        this.setState({ error: error, loading: false });
      });
  };

  searchBarTextChanged = query => {
    this.setState({ searchQuery: query }, () => this.searchForDrink());
  };

  ratingCompleted = rating => {
    console.log(rating);
  };

  refresh = async () => {
    this.loadAllDrinks();
  };

  render() {
    return (
      <View>
        <BasicCocktailList
          showSearchBar={true}
          drinks={this.state.allDrinks}
          searchBarTextChanged={this.searchBarTextChanged}
          refresh={this.refresh}
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