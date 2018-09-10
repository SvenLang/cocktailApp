import _ from 'lodash';
import allDrinks from './allDrinks';
import { SQLite, FileSystem as FS, Asset } from 'expo';

/*************************************
 * Auxiliary functions usable database independent
 **************************************/

const contains = ({ name, category }, searchQuery) => {
	let nameLC = name.toLowerCase();
	categoryLC = category.toLowerCase();
	searchQuery = searchQuery.toLowerCase();
	if (nameLC.includes(searchQuery) || categoryLC.includes(searchQuery)) {
		return true;
	}
	return false;
};

/*************************************
 * SQL data basis
 **************************************/

//The database needs to be downloaded first, otherwise a new empty database is created!
async () => {
	await FS.downloadAsync(Asset.fromModule(require('./drinksDB.db')).uri, `${FS.documentDirectory}SQLite/drinksDB.db`);
};

const db = SQLite.openDatabase('drinksDB.db');

const sql_getCocktailInfo = cocktail => {
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

const sql_fillCocktailWithIngredients = cocktail => {
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

const sql_getRandomDrink = () => {
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
						//console.log(cocktail);
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

/***************************************
 * JavaScript data basis
 ***************************************/

const js_getDrinks = (limit, searchQuery) => {
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

const js_getRandomDrink = () => {
	return new Promise((resolve, reject) => {
		resolve(allDrinks[Math.floor(Math.random() * allDrinks.length - 1)]);
	});
};

//Get all Cocktails with a rating equal 5
const js_getFavDrinks = limit => {
	return new Promise((resolve, reject) => {
		const result = _.filter(allDrinks, drink => {
			if (drink.rating === 5) {
				return true;
			} else {
				return false;
			}
		});
		resolve(_.take(result, limit));
	});
};

export const writeRating = drink => {};

/***************************************
 * abstract function methods
 ***************************************/

/**
 * Get a list of drinks.
 * @param {*} dbSelector Select the database, where the data can be retrieved. Allowed values = [js|sql]. Default: js
 * @param {*} limit Restrict the number of items returned to limit
 * @param {*} searchQuery Only return those items that fit the provided searchQuery
 */
export const getDrinks = (dbSelector = 'js', limit = 20, searchQuery = '') => {
	switch (dbSelector) {
		case 'js':
			return js_getDrinks(limit, searchQuery);
		case 'sql':
			//TODO: Implement sql_getDrinks!
			return js_getDrinks(limit, searchQuery);
		default:
			return Promise.reject('No such dbSelector: ' + dbSelector);
	}
};

/**
 * Return one random cocktail.
 * @param {*} dbSelector Select the database, where the data can be retrieved. Allowed values = [js|sql]. Default: js
 */
export const getRandomDrink = dbSelector => {
	switch (dbSelector) {
		case 'js':
			return js_getRandomDrink();
		case 'sql':
			return sql_getRandomDrink();
		default:
			return Promise.reject('No such dbSelector: ' + dbSelector);
	}
};

/**
 * Get a list of favorite cocktails. Favorites are cocktails with 5 star rating.
 * @param {*} dbSelector Select the database, where the data can be retrieved. Allowed values = [js|sql]. Default: js
 * @param {*} limit Only return those items that fit the provided searchQuery
 */
export const getFavDrinks = (dbSelector = 'js', limit = 150) => {
	switch (dbSelector) {
		case 'js':
			return js_getFavDrinks(limit);
		case 'sql':
			//TODO: Implement sql_getFavDrinks!
			return js_getFavDrinks(limit);
		default:
			return Promise.reject('No such dbSelector: ' + dbSelector);
	}
};

/**
 * Return a list of all categories in alphabetic order
 */
export const getCategories = () => {
	return [...new Set(allDrinks.map(item => item.category))].sort();
};

/**
 * Return a list of all glass types in alphabetic order
 */
export const getGlasses = () => {
	return [...new Set(allDrinks.map(item => item.glass))].sort();
};

export const insertNewCocktail = (dbSelector = 'js', cocktail) => {
	switch (dbSelector) {
		case 'js':
			var oldArrayLength = allDrinks.length;
			var newArrayLength = allDrinks.push(cocktail);
			return newArrayLength > oldArrayLength;
		case 'sql':
			//TODO: Implement sql_getFavDrinks!
			return js_getFavDrinks(limit);
		default:
			return Promise.reject('No such dbSelector: ' + dbSelector);
	}
};

export default getDrinks;
