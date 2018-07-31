import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

export default class Maexle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diceOne: undefined,
      diceTwo: undefined,
      maexleThrowResult: undefined
    };
  }

  rollTheDice() {
    diceOne = Math.floor(Math.random() * 6) + 1;
    diceTwo = Math.floor(Math.random() * 6) + 1;
    if (diceOne < diceTwo) {
      maexleThrowResult = diceTwo * 10 + diceOne;
    } else {
      maexleThrowResult = diceOne * 10 + diceTwo;
    }
    console.log(diceOne, diceTwo, maexleThrowResult);
    this.setState({
      diceOne: diceOne,
      diceTwo: diceTwo,
      maexleThrowResult: maexleThrowResult
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Würfel 1: {this.state.diceOne}</Text>
        <Text>Würfel 2: {this.state.diceTwo}</Text>
        <Text>Maexle Ergebniss: {this.state.maexleThrowResult}</Text>
        <Button title={"roll the dices"} onPress={() => this.rollTheDice()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  buttongroup: {
    height: 30
  }
});
