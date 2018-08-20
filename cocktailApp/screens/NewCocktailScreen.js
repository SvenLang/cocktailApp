import React from "react";
import { ScrollView, Button, StyleSheet } from "react-native";
import Store from "../Firebase/Store";

export default class NewCockailScreen extends React.Component {
  static navigationOptions = {
    title: "Add new cocktail"
  };

  constructor(props) {
    super(props);
  }

  testFirebase = async () => {
    const allDrinks = await Store.loadAllDrinks();
    console.log(allDrinks);
  };

  addNewCocktail = () => {
    Store.saveAllDrinks();
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Button title="Test Firebase" onPress={() => this.testFirebase()} />
        <Button
          title="Save All Cocktails in Firebase"
          onPress={() => this.addNewCocktail()}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff"
  }
});
