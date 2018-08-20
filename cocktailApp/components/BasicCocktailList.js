import React from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { ListItem, SearchBar, Rating } from "react-native-elements";
import CocktailCard from "../components/CocktailCard";
import Store from "../Firebase/Store";

export default class CocktailList extends React.Component {
  constructor(props) {
    super(props);

    this.refresh = props.refresh;

    this.state = {
      loading: false,
      showCocktailCardModalVisible: false,
      clickedCocktail: undefined,
      error: null,
      drinks: undefined,
      showSearchBar: this.props.showSearchBar
    };
  }

  static navigationOptions = {
    title: "Cocktails"
  };

  showCocktailCardModal(cocktail) {
    this.setState({ showCocktailCardModalVisible: true });
    this.setState({ clickedCocktail: cocktail });
  }

  flatListHeaderComponent = () => {
    if (this.state.showSearchBar === true) {
      return (
        <SearchBar
          placeholder="Search for ..."
          lightTheme
          round
          onChangeText={this.props.searchBarTextChanged}
        />
      );
    } else {
      return null;
    }
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

  ratingCompleted = async rating => {
    console.log(rating);
    clickedCocktail = this.state.clickedCocktail;
    clickedCocktail.rating = rating;
    await Store.storeRatingChange(clickedCocktail, rating);
    this.refresh();
  };

  render() {
    return (
      <View>
        <CocktailCard
          visible={this.state.showCocktailCardModalVisible}
          onRequestClose={() => {
            this.setState({ showCocktailCardModalVisible: false });
          }}
          cocktailToShow={this.state.clickedCocktail}
          ratingCompleted={this.ratingCompleted}
        />
        <FlatList
          data={this.props.drinks}
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
