import React from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

export default class Maexle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diceOne: undefined,
      diceTwo: undefined,
      maexleThrowResult: undefined,
      scoreToBeat: 0,
      typedScore: undefined,
      saidScoreToNeighbor: undefined,
      diced: false,
      scoreIsSaidToNeihbor: false,
      realMaexleResultThrowedBefore: undefined
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
      maexleThrowResult: maexleThrowResult,
      realMaexleResultThrowedBefore: maexleThrowResult,
      diced: true
    });
  }

  onChangeTextResultToSay(text) {
    if (text.length > 2) {
      alert("to much numbers");
      return;
    }
    diceOne = parseInt(text.slice(0, 1));
    diceTwo = parseInt(text.slice(1, 2));
    if (diceOne < diceTwo) {
      alert("no correct maexle result. Perhaps you mean " + diceTwo + diceOne);
    } else {
      typedScore = diceOne * 10 + diceTwo;
      this.setState({ typedScore: typedScore });
    }
  }

  sayThrowResultToNeigbor() {
    if (this.state.maexleThrowResult !== undefined) {
      console.log("1");
      console.log(this.state.maexleThrowResult);
      console.log(this.state.scoreToBeat);
      if (this.state.maexleThrowResult > this.state.scoreToBeat) {
        console.log("2");
        this.setState({
          saidScoreToNeighbor: this.state.maexleThrowResult,
          scoreIsSaidToNeihbor: true,
          diceOne: undefined,
          diceTwo: undefined,
          maexleThrowResult: undefined
        });
      } else {
        alert("Your result must beat the score to beat!");
      }
    }
  }

  sayTypedResultToNeighbor() {
    if (this.state.typedScore !== undefined) {
      if (this.state.typedScore > this.state.scoreToBeat) {
        this.setState({
          saidScoreToNeighbor: this.state.typedScore,
          scoreIsSaidToNeihbor: true,
          diceOne: undefined,
          diceTwo: undefined,
          maexleThrowResult: undefined,
          typedScore: ""
        });
      } else {
        alert("Your result must beat the score to beat!");
      }
    }
  }
  believeTheResult() {
    this.setState({
      scoreToBeat: this.state.saidScoreToNeighbor,
      saidScoreToNeighbor: undefined,
      diced: false,
      scoreIsSaidToNeihbor: false
    });
  }
  notBelieveTheResult() {
    if (
      this.state.realMaexleResultThrowedBefore ===
      this.state.saidScoreToNeighbor
    ) {
      alert("The score he/she said was truth! You Lost!!!");
    } else {
      alert("He/She lied. The said score was not right. You Neighbor Lost!!!");
    }
    this.newGameStart();
  }

  newGameStart() {
    console.log("New Game");
    this.setState({
      diceOne: undefined,
      diceTwo: undefined,
      maexleThrowResult: undefined,
      scoreToBeat: 0,
      typedScore: undefined,
      saidScoreToNeighbor: undefined,
      diced: false,
      scoreIsSaidToNeihbor: false,
      realMaexleResultThrowedBefore: undefined
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>said result: {this.state.saidScoreToNeighbor}</Text>
        <Text>Score to beat: {this.state.scoreToBeat}</Text>
        <Text>Dice 1: {this.state.diceOne}</Text>
        <Text>Dice 2: {this.state.diceTwo}</Text>
        <Text>Maexle result: {this.state.maexleThrowResult}</Text>
        <Text>Result to say neighbor:</Text>
        <TextInput
          placeholder={"result..."}
          onChangeText={text => this.onChangeTextResultToSay(text)}
          value={this.state.typedScore}
        />
        <Button
          disabled={this.state.diced}
          title={"roll the dices"}
          onPress={() => this.rollTheDice()}
        />
        <Button
          disabled={this.state.scoreIsSaidToNeihbor || !this.state.diced}
          title={"say throw result to neighbor"}
          onPress={() => this.sayThrowResultToNeigbor()}
        />
        <Button
          disabled={this.state.scoreIsSaidToNeihbor || !this.state.diced}
          title={"say typed result to neighbor"}
          onPress={() => this.sayTypedResultToNeighbor()}
        />
        <Text>Believe the result? </Text>
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <Button
            disabled={!this.state.saidScoreToNeighbor}
            title={"Yes"}
            onPress={() => this.believeTheResult()}
          />
          <Button
            disabled={!this.state.saidScoreToNeighbor}
            title={"No"}
            onPress={() => this.notBelieveTheResult()}
          />
        </View>
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
