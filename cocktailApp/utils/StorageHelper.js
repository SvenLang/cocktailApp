import { SQLite, FileSystem as FS, Asset } from 'expo';

//The database needs to be downloaded first, otherwise a new empty database is created!
FS.downloadAsync(
	Asset.fromModule(require('../assets/drinks/drinksDB.db')).uri,
	`${FS.documentDirectory}SQLite/drinksDB.db`
);
const db = SQLite.openDatabase('drinksDB.db');

/*****************************************************************************
 * This is just a block of private helper function that do not get exported
 *****************************************************************************/

sql_getCocktailInfo = cocktail => {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT c.id, c.name, c.rating, c.thumbnail, c.instruction, t.name as type, g.type as glass from (SELECT * from cocktails ORDER BY RANDOM() LIMIT 1) c LEFT JOIN types t ON t.id = c.type_id LEFT JOIN glasses g ON g.id = c.glass_id;`,
				[],
				(tx, results) => {
					cocktail.id = results.rows._array[0].id;
					cocktail.name = results.rows._array[0].name;
					cocktail.glass = results.rows._array[0].glass;
					cocktail.rating = results.rows._array[0].rating;
					cocktail.category = results.rows._array[0].type;
					cocktail.drinkThumb = results.rows._array[0].thumbnail;
					cocktail.instructions = results.rows._array[0].instruction;
					resolve(cocktail);
				},
				(tx, error) => {
					reject(error);
				}
			);
		});
	});
};

sql_fillCocktailWithIngredients = cocktail => {
	return new Promise((resolve, reject) => {
		db.transaction(tx => {
			tx.executeSql(
				`SELECT i.name as ingredient, r.measure FROM ingredients i JOIN recipes r ON i.id = r.ingredient_id JOIN cocktails c ON c.id = r.cocktail_id WHERE c.id = ?;`,
				[cocktail.id],
				(tx, results) => {
					results.rows._array.forEach(element => {
						cocktail.ingredients.push({
							ingredient: element.ingredient,
							measure: element.measure,
						});
					});
					resolve(cocktail);
				},
				(tx, error) => {
					reject(error);
				}
			);
		});
	});
};

export const db_getRandomCocktail = () => {
	//define an empty cocktail object that should be returned
	let cocktail = {
		id: null,
		name: null,
		glass: null,
		rating: 0,
		category: null,
		drinkThumb: null,
		instructions: null,
		ingredients: [],
	};

	return new Promise((resolve, reject) => {
		sql_getCocktailInfo(cocktail)
			.then(cocktail => {
				sql_fillCocktailWithIngredients(cocktail)
					.then(cocktail => {
						console.log(cocktail);
						resolve(cocktail);
					})
					.catch(error => {
						console.log(error);
						reject(error);
					});
			})
			.catch(error => {
				console.log(error);
				reject(error);
			});
	});
};
