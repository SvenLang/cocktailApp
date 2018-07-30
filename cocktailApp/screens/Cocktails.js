import React from "react";
import { StyleSheet, View } from "react-native";
import { ButtonGroup } from "react-native-elements";
import CocktailList from "./CocktailList";
import RandomCocktail from "./RandomCocktail";
import FavoriteList from "./FavoriteList";

export default class Cocktails extends React.Component {
  static navigationOptions = {
    title: "Cocktails"
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const buttons = ["List", "Random", "Favorite"];
    const selectedIndex = this.state.selectedIndex;
    var content = undefined;

    //Select the right content which is selected with the buttons at the top bar
    switch (this.state.selectedIndex) {
      case 0:
        content = <CocktailList showSearchBar={true} />;
        break;
      case 1:
        content = <RandomCocktail />;
        break;
      case 2:
        content = <FavoriteList />;
        break;
      default:
        break;
    }

    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={styles.buttongroup}
        />
        <View>{content}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  buttongroup: {
    height: 30
  }
});
