import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground
} from "react-native";
import { Button } from "react-native-elements";

const imgDices = [
  require("../../assets/images/cubeUnmarked.png"),
  require("../../assets/images/cubeOne.png"),
  require("../../assets/images/cubeTwo.png"),
  require("../../assets/images/cubeThree.png"),
  require("../../assets/images/cubeFour.png"),
  require("../../assets/images/cubeFive.png"),
  require("../../assets/images/cubeSix.png")
];

export default class Maexle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diceOne: undefined,
      diceTwo: undefined,
      doublet: false,
      maexleThrowResult: 0,
      scoreToBeat: 0,
      typedDiceOne: undefined,
      typedDiceTwo: undefined,
      typedScore: undefined,
      saidScoreToNeighbor: undefined,
      diced: false,
      scoreIsSaidToNeihbor: false,
      realMaexleResultThrowedBefore: undefined,
      doubletThrowedBefore: false,
      imgDiceOne: imgDices[0],
      imgDiceTwo: imgDices[0]
    };
  }

  imgDiceOne = "";

  rollTheDice() {
    diceOne = Math.floor(Math.random() * 6) + 1;
    diceTwo = Math.floor(Math.random() * 6) + 1;
    if (diceOne < diceTwo) {
      maexleThrowResult = diceTwo * 10 + diceOne;
      doublet = false;
    } else if (diceOne === diceTwo) {
      maexleThrowResult = diceOne * 10 + diceTwo;
      doublet = true;
    } else {
      maexleThrowResult = diceOne * 10 + diceTwo;
      doublet = false;
    }
    console.log(diceOne, diceTwo, maexleThrowResult);
    this.setState({
      diceOne: diceOne,
      diceTwo: diceTwo,
      doublet: doublet,
      maexleThrowResult: maexleThrowResult,
      realMaexleResultThrowedBefore: maexleThrowResult,
      diced: true,
      imgDiceOne: imgDices[diceOne],
      imgDiceTwo: imgDices[diceTwo]
    });
    if (maexleThrowResult === 21) {
      alert("MAEXLE!!!");
      this.newGameStart();
    }
    if (this.state.scoreToBeat === 66 && maexleThrowResult !== 21) {
      alert(
        "You don´t throw 21 and the score to beat was 66, so a new Game starts. You Lost!"
      );
      this.newGameStart();
    }
  }

  onChangeTextResultToSay(text) {
    if (text.length > 2) {
      alert("to much numbers");
      return;
    }
    typedDiceOne = parseInt(text.slice(0, 1));
    typedDiceTwo = parseInt(text.slice(1, 2));
    if (typedDiceOne < typedDiceTwo) {
      alert(
        "no correct maexle result. Perhaps you mean " +
          typedDiceTwo +
          typedDiceOne
      );
    } else {
      typedScore = typedDiceOne * 10 + typedDiceTwo;
      this.setState({
        typedScore: typedScore,
        typedDiceOne: typedDiceOne,
        typedDiceTwo: typedDiceTwo
      });
    }
  }

  sayThrowResultToNeigbor() {
    if (this.state.maexleThrowResult !== 0) {
      console.log("1");
      console.log(this.state.maexleThrowResult);
      console.log(this.state.scoreToBeat);
      //Throwed a doublet
      if (this.state.doublet) {
        if (this.state.doubletThrowedBefore) {
          if (this.state.maexleThrowResult > this.state.scoreToBeat) {
            this.setState({
              doubletThrowedBefore: true,
              saidScoreToNeighbor: this.state.maexleThrowResult,
              scoreIsSaidToNeihbor: true,
              maexleThrowResult: 0,
              imgDiceOne: imgDices[0],
              imgDiceTwo: imgDices[0]
            });
          } else {
            alert("Your ressult must beat the score to beat!");
          }
        } else {
          this.setState({
            doubletThrowedBefore: true,
            saidScoreToNeighbor: this.state.maexleThrowResult,
            scoreIsSaidToNeihbor: true,
            maexleThrowResult: 0,
            imgDiceOne: imgDices[0],
            imgDiceTwo: imgDices[0]
          });
        }
      } //No doublet was throwed
      else if (!this.state.doublet) {
        if (this.state.doubletThrowedBefore) {
          alert("Your result must beat the score to beat!");
        } else {
          if (this.state.maexleThrowResult > this.state.scoreToBeat) {
            console.log("2");
            this.setState({
              saidScoreToNeighbor: this.state.maexleThrowResult,
              scoreIsSaidToNeihbor: true,
              maexleThrowResult: 0,
              imgDiceOne: imgDices[0],
              imgDiceTwo: imgDices[0]
            });
          } else {
            alert("Your result must beat the score to beat!");
          }
        }
      }
    }
  }

  sayTypedResultToNeighbor() {
    if (this.state.typedScore !== undefined) {
      //Doublet was throwed before
      if (this.state.doubletThrowedBefore) {
        if (
          this.state.typedDiceOne === this.state.typedDiceTwo &&
          this.state.typedScore > this.state.scoreToBeat
        ) {
          this.setState({
            saidScoreToNeighbor: this.state.typedScore,
            scoreIsSaidToNeihbor: true,
            doubletThrowedBefore: true,
            maexleThrowResult: 0,
            typedScore: "",
            imgDiceOne: imgDices[0],
            imgDiceTwo: imgDices[0]
          });
        } else {
          alert("Your result must beate the score to beat!");
        }
      } else if (!this.state.doubletThrowedBefore) {
        if (this.state.typedDiceOne === this.state.typedDiceTwo) {
          this.setState({
            saidScoreToNeighbor: this.state.typedScore,
            scoreIsSaidToNeihbor: true,
            doubletThrowedBefore: true,
            maexleThrowResult: 0,
            typedScore: "",
            imgDiceOne: imgDices[0],
            imgDiceTwo: imgDices[0]
          });
        } else {
          if (this.state.typedScore > this.state.scoreToBeat) {
            this.setState({
              saidScoreToNeighbor: this.state.typedScore,
              scoreIsSaidToNeihbor: true,
              maexleThrowResult: 0,
              typedScore: "",
              imgDiceOne: imgDices[0],
              imgDiceTwo: imgDices[0]
            });
          } else {
            alert("Your result must beat the score to beat!");
          }
        }
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
    this.setState({
      imgDiceOne: imgDices[this.state.diceOne],
      imgDiceTwo: imgDices[this.state.diceTwo]
    });
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
      doublet: false,
      maexleThrowResult: 0,
      scoreToBeat: 0,
      typedDiceOne: undefined,
      typedDiceTwo: undefined,
      typedScore: undefined,
      saidScoreToNeighbor: undefined,
      diced: false,
      scoreIsSaidToNeihbor: false,
      realMaexleResultThrowedBefore: undefined,
      doubletThrowedBefore: false
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/MaexleBackground2.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                margin: 5
              }}
            >
              <Text style={styles.textStyle}>Said result:</Text>
              <Text style={styles.textStyle}>
                {this.state.saidScoreToNeighbor}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                margin: 5
              }}
            >
              <Text style={styles.textStyle}>Score to beat:</Text>
              <Text style={styles.textStyle}>{this.state.scoreToBeat}</Text>
            </View>
          </View>
          <View style={styles.cubesView}>
            <Image source={this.state.imgDiceOne} style={styles.cubeImg} />
            <Image source={this.state.imgDiceTwo} style={styles.cubeImg} />
          </View>
          <Button
            disabled={this.state.diced}
            title={"roll the dices"}
            titleStyle={styles.buttonTitleStyle}
            onPress={() => this.rollTheDice()}
            buttonStyle={styles.buttonStyle}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                margin: 5
              }}
            >
              <Text style={styles.textStyle}>Maexle result:</Text>
              <Text style={styles.textStyle}>
                {this.state.maexleThrowResult}
              </Text>
              <Button
                disabled={this.state.scoreIsSaidToNeihbor || !this.state.diced}
                title={"say throw result"}
                titleStyle={styles.buttonTitleStyle}
                onPress={() => this.sayThrowResultToNeigbor()}
                buttonStyle={styles.buttonStyle}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                margin: 5
              }}
            >
              <Text style={styles.textStyle}>Type a result:</Text>
              <TextInput
                placeholder={"result"}
                placeholderTextColor="black"
                onChangeText={text => this.onChangeTextResultToSay(text)}
                value={this.state.typedScore}
                maxLength={2}
                keyboardType={"numeric"}
                style={styles.textInputStyle}
              />
              <Button
                disabled={this.state.scoreIsSaidToNeihbor || !this.state.diced}
                title={"say typed result"}
                titleStyle={styles.buttonTitleStyle}
                onPress={() => this.sayTypedResultToNeighbor()}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
          <View style={{ margin: 5 }}>
            <Text style={styles.textStyle}>Believe the result? </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Button
                disabled={!this.state.saidScoreToNeighbor}
                title={"Yes"}
                onPress={() => this.believeTheResult()}
                titleStyle={styles.buttonTitleStyle}
                buttonStyle={styles.buttonStyle}
              />
              <Button
                disabled={!this.state.saidScoreToNeighbor}
                title={"No"}
                onPress={() => this.notBelieveTheResult()}
                titleStyle={styles.buttonTitleStyle}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "column"
  },
  buttongroup: {
    height: 30
  },
  cubesView: {
    flexDirection: "row",
    justifyContent: "center"
  },
  cubeImg: {
    height: 100,
    width: 100,
    margin: 10
  },
  buttonStyle: {
    height: 40,
    margin: 5
  },
  buttonTitleStyle: {
    fontSize: 22
  },
  textStyle: {
    fontSize: 20
  },
  textInputStyle: {
    fontSize: 20,
    color: "black",
    borderColor: "black",
    borderWidth: 1,
    width: 50
  }
});
