import React from "react";
import { StyleSheet, View } from "react-native";
import { getDrinks } from "../assets/drinks/DrinksInterface";
import BasicCocktailList from "../components/BasicCocktailList";

//const allDrinks = require("../assets/drinks/allDrinksModified.json");

export default class CocktailList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      allDrinks: [],
      searchQuery: "",
      error: null,
      showSearchBar: this.props.showSearchBar
    };
  }

  static navigationOptions = {
    title: "Cocktails"
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }
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
    this.setState({ searchQuery: query }, () => this.makeRemoteRequest());
  };

  render() {
    return (
      <View>
        <BasicCocktailList
          showSearchBar={true}
          drinks={this.state.allDrinks}
          searchBarTextChanged={this.searchBarTextChanged}
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
