import React from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { List, ListItem, SearchBar, Rating } from "react-native-elements";
import CocktailCard from "../components/CocktailCard";
import { getDrinks } from "../assets/drinks/DrinksInterface";

//const allDrinks = require("../assets/drinks/allDrinksModified.json");

export default class CocktailList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showCocktailCardModalVisible: false,
      allDrinks: [],
      clickedCocktail: undefined,
      searchQuery: "",
      error: null
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

  showCocktailCardModal(cocktail) {
    this.setState({ showCocktailCardModalVisible: true });
    this.setState({ clickedCocktail: cocktail });
  }

  searchBarTextChanged = query => {
    this.setState({ searchQuery: query }, () => this.makeRemoteRequest());
  };

  flatListHeaderComponent = () => {
    return (
      <SearchBar
        placeholder="Suche nach..."
        lightTheme
        round
        onChangeText={this.searchBarTextChanged}
      />
    );
  };

  flatListFooterComponent = () => {
    if (!this.state.loading) {
      return null;
    }
    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <View>
        <CocktailCard
          visible={this.state.showCocktailCardModalVisible}
          onRequestClose={() =>
            this.setState({ showCocktailCardModalVisible: false })
          }
          cocktailToShow={this.state.clickedCocktail}
        />
        <FlatList
          data={this.state.allDrinks}
          renderItem={({ item }) => (
            <View>
              <Rating
                readonly
                imageSize={18}
                style={styles.rating}
                startingValue={item.rating}
              />
              <ListItem
                roundAvatar
                title={item.name}
                subtitle={item.category}
                avatar={{ uri: item.drinkThumb }}
                onPress={() => this.showCocktailCardModal(item)}
              />
            </View>
          )}
          keyExtractor={item => item.key.toString()}
          ListHeaderComponent={this.flatListHeaderComponent}
          stickyHeaderIndices={[0]} //For a fixed Searchbar Header
          ListFooterComponent={this.flatListFooterComponent}
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
