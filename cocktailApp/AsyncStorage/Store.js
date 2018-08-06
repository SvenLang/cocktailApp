import { AsyncStorage } from "react-native";

const allDrinks_Key = "AllDrink_Items";

export default class Store {
  static loadAllDrinks = async () => {
    let allDrinks = null;
    try {
      const jsonItems = await AsyncStorage.getItem(allDrinks_Key);
      items = JSON.parse(jsonItems);
    } catch (error) {
      console.error("Error loading all drinks.", error.message);
    }
    return items || [];
  };
  static saveAllDrinks = async items => {
    try {
      await AsyncStorage.setItem(allDrinks_Key, JSON.stringify(items));
      console.log("All Drinks are stored");
      console.log(items);
    } catch (error) {
      console.error("Error saving all drinks.", error.message);
    }
  };
  static deleteAllDrinks = async () => {
    try {
      await AsyncStorage.removeItem(allDrinks_Key);
    } catch (error) {
      console.error("Error deleting all drinks.", error.message);
    }
  };
}
