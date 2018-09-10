import _ from "lodash";
import Firebase from "../Firebase/Firebase";

export default class Store {
  static loadAllDrinks = async () => {
    firebase = new Firebase();
    let allDrinks = [];
    await firebase.db
      .collection("Drinks")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(drink => {
          allDrinks.push(drink.data());
        });
      })
      .then(() => {
        allDrinks.sort((a, b) => {
          let nameA = a.name.toLowerCase();
          let nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
      });
    return allDrinks;
  };
  static searchForDrink = async (allDrinks, query) => {
    //const allDrinks = await Store.loadAllDrinks();
    searchResult = allDrinks.filter(drink => {
      nameLC = drink.name.toLowerCase();
      categoryLC = drink.category.toLowerCase();
      query = query.toLowerCase();
      if (nameLC.includes(query) || categoryLC.includes(query)) {
        return true;
      } else {
        return false;
      }
    });
    return searchResult || [];
  };

  static getFavouriteDrinks = async (top = 50) => {
    let allDrinks = await Store.loadAllDrinks();
    allDrinks.sort((a, b) => {
      return b.rating - a.rating;
    });
    favouriteDrinks = allDrinks.slice(0, top);
    return favouriteDrinks;
  };

  static storeRatingChange = async (item, rating) => {
    //Muss abegeändert werden, da in Firebase die Cocktails nicht als Array sonder als Collection mit jeweils eigenen Dokumenten je Cocktail abgespeichert sind
    //Vorgehen: 1.Suche in Firebase nach Dokument des Cocktails, welcher abgeändert werden soll, 2. Object lokal laden und wert abänder
    //3. Dokument in Firebase neu speichern bzw. überspeichern.
    var drinkToChange;
    var drinksRef = await firebase.db.collection("Drinks");
    var query = await drinksRef
      .where("name", "==", item.name)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          drinkToChange = doc;
        });
      });
    drinkToChange.data().rating = rating;
    drinksRef = await firebase.db.collection("Drinks").doc(drinkToChange.id);
    drinksRef.update({ rating: rating });
  };

  static saveNewDrink = async newDrink => {
    await Firebase.db
      .collection("Drinks")
      .add(newDrink)
      .then(ref => {
        console.log(ref.id);
      });
  };

  static saveAllDrinks = allDrinks => {
    allDrinks.forEach(drink => {
      Firebase.db
        .collection("Drinks")
        .add(drink)
        .then(ref => {
          console.log(ref.id);
        });
    });
  };
}
