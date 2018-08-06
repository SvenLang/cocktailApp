import { AsyncStorage } from "react-native";
import _ from "lodash";

const allDrinks_Key = "AllDrink_Items";

export default class Store {
  static loadAllDrinks = async () => {
    let allDrinks = null;
    try {
      const jsonItems = await AsyncStorage.getItem(allDrinks_Key);
      allDrinks = JSON.parse(jsonItems);
      console.log("All Drinks are loaded.");
    } catch (error) {
      console.error("Error loading all drinks.", error.message);
    }
    return allDrinks || [];
  };

  static saveAllDrinks = async items => {
    try {
      await AsyncStorage.setItem(allDrinks_Key, JSON.stringify(items));
      console.log("All Drinks are stored");
    } catch (error) {
      console.error("Error saving all drinks.", error.message);
    }
  };

  static mergeAllDrinks = async item => {
    try {
      await AsyncStorage.mergeItem(allDrinks_Key, JSON.stringify(item));
      console.log("All Drinks are merged");
    } catch (error) {
      console.error("Error merging all Drinks.", error.message);
    }
  };

  static deleteAllDrinks = async () => {
    try {
      await AsyncStorage.removeItem(allDrinks_Key);
    } catch (error) {
      console.error("Error deleting all drinks.", error.message);
    }
  };

  static storeRatingChange = async (item, rating) => {
    allDrinks = await Store.loadAllDrinks();
    const itemToChange = allDrinks.find(drink => drink.name === item.name);
    itemToChange.rating = rating;
    const indexFromItemToChange = _.findIndex(allDrinks, drink => {
      return drink.name === item.name;
    });
    _.remove(allDrinks, drink => {
      return drink.name === item.name;
    });
    Array.prototype.insert = function(index, item) {
      this.splice(index, 0, item);
    };
    allDrinks.insert(indexFromItemToChange, itemToChange);
    await Store.saveAllDrinks(allDrinks);
  };
}
