import _ from "lodash";
import allDrinks from "./allDrinks";

export const contains = ({ name, category }, searchQuery) => {
  let nameLC = name.toLowerCase();
  categoryLC = category.toLowerCase();
  searchQuery = searchQuery.toLowerCase();
  if (nameLC.includes(searchQuery) || categoryLC.includes(searchQuery)) {
    return true;
  }
  return false;
};

export const getDrinks = (limit = 20, searchQuery = "") => {
  console.log("API called " + searchQuery);
  return new Promise((resolve, reject) => {
    if (searchQuery.length === 0) {
      resolve(_.take(allDrinks, limit));
    } else {
      const result = _.filter(allDrinks, drink => {
        return contains(drink, searchQuery);
      });
      resolve(_.take(result, limit));
    }
  });
};

export default getDrinks;
