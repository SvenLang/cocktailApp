import sqlite3
import csv

###############################################
# In this sections all SQL statements for
# later use will be defined
###############################################

###
# Table Ingredients
# A list of all possible ingredients
# examples:
####
sql_create_ingredients_table = """CREATE TABLE IF NOT EXISTS ingredients (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text unique NOT NULL
); """

###
# Table Glasses
# A list of all possbile cocktail glasses
# examples: Old-fashioned glass, Shot glass, Highball glass
####
sql_create_glasses_table = """CREATE TABLE IF NOT EXISTS glasses (
    id integer PRIMARY KEY AUTOINCREMENT,
    type text unique NOT NULL
);"""

###
# Table Types
# List of different types
# examples: shots, cocktail ,beer
####
sql_create_types_table = """CREATE TABLE IF NOT EXISTS types (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text unique NOT NULL
);"""

###
# Table Groups
# List of different categories
# examples: Unforgettables, New Era Drinks
####
sql_create_categories_table = """CREATE TABLE IF NOT EXISTS categories (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text unique NOT NULL
);"""

###
# Table Ingredient
# ID:   id integer primary key autoincrement
# Name: name
# examples:
####
sql_create_cocktail_table = """CREATE TABLE IF NOT EXISTS cocktails (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL,
    isAlcoholic integer NOT NULL,
    thumbnail text,
    rating integer,
    instruction text NOT NULL,
    category_id integer,
    glass_id integer,
    type_id integer,
    FOREIGN KEY (category_id) REFERENCES glasses (id),
    FOREIGN KEY (glass_id) REFERENCES categories (id),
    FOREIGN KEY (type_id) REFERENCES types (id)
); """

###
# Table Recipe
# AS between Cocktail and Ingredient there is an M:N relationship, this table
# is used to break that.
# In addition, each ingredient also has a a measure
####
sql_create_recipe_table = """CREATE TABLE IF NOT EXISTS recipes (
    id integer PRIMARY KEY AUTOINCREMENT,
    cocktail_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    measure text,
    FOREIGN KEY (cocktail_id) REFERENCES cocktails (id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id)
);"""


sql_query_for_glass_id = """SELECT id from glasses where type = ?"""
sql_insert_new_glass = """INSERT INTO glasses(type) VALUES (?)"""
sql_query_for_type_id = """SELECT id from types where name = ?"""
sql_insert_new_type = """INSERT INTO types(name) VALUES (?)"""
sql_query_for_category_id = """SELECT id from categories where name = ?"""
sql_insert_new_category = """INSERT INTO categories(name) VALUES (?)"""
sql_query_for_ingredient_id = """SELECT id from ingredients where name = ?"""
sql_insert_new_ingredient = """INSERT INTO ingredients(name) VALUES (?)"""
sql_insert_new_recipe_part = """INSERT INTO recipes(cocktail_id, ingredient_id, measure) VALUES(?,?,?)"""
sql_insert_new_cocktail = """INSERT INTO cocktails(name, isAlcoholic, thumbnail, rating, instruction, category_id, glass_id, type_id) VALUES(?,?,?,?,?,?,?,?)"""

DEFAULT_RATING = 0
ROW_INDEX_COCKTAIL_NAME = 1
ROW_INDEX_ALCOHOLIC = 4
ROW_INDEX_TYPES = 5
ROW_INDEX_THUMBNAIL = 6
ROW_INDEX_GLASSES = 7
ROW_INDEX_CATEGORIES = 8
ROW_INDEX_INSTRUCTIONS = 24
ROW_INDEX_INGREDIENT_BEGIN = 9
ROW_INDEX_INGREDIENT_END = 24
MEASUREMENT_STEP = 16


###############################################
# In this sections all functions get declared
###############################################


def create_db_tables(db):
    """
    Create all required tables for the drinksDB

    :param db:  The database handle to create a cursor on
    """
    c = db.cursor()
    c.execute(sql_create_ingredients_table)
    c.execute(sql_create_glasses_table)
    c.execute(sql_create_types_table)
    c.execute(sql_create_categories_table)
    c.execute(sql_create_cocktail_table)
    c.execute(sql_create_recipe_table)


def insert_new_if_not_present(db, select_query, insert_query, item):
    """
    Insert items that should be unique. 
    If they already exist, the existing ID wil be returned

    :param db:              The database handle to create a cursor on
    :param select_query:    SQL-query to search if the item already exists
    :param insert_query:    SQL-query to add an unknown item to the database
    :param item:            data to insert into the database
    :returns:               The id of the item, either newly created or already existent
    """

    item_id = None

    # perform the database operations
    c = db.cursor()
    c.execute(select_query, (item,))
    item_id = c.fetchone()
    if item_id is None:
        # the item has not been found
        c.execute(insert_query, (item,))
        item_id = c.lastrowid
    else:
        # the return value of fetchone is still a tuple
        item_id = item_id[0]

    return item_id


def insert_new_cocktail(db, row, glass_id, types_id, category_id):
    """
    Store the basic componenets of a cocktail, however the ingredients are not yet mapped

    :param db:          The database handle to create a cursor on
    :param row:         Whole input from the CSV file
    :param glass_id:    The ID of the glass of the cocktail
    :param types_id:    The ID of the cocktail type like Shots or Beer
    :param category_id: The ID of a category like Unforgettables (can be None)
    :returns:           The ID of the newly created cocktail
    """
    c = db.cursor()

    isAlcoholic = 0
    if row[ROW_INDEX_ALCOHOLIC] == "Alcoholic":
        isAlcoholic = 1
    if category_id is None:
        category_id = "NULL"

    c.execute(sql_insert_new_cocktail,
              (row[ROW_INDEX_COCKTAIL_NAME], isAlcoholic, row[ROW_INDEX_THUMBNAIL], DEFAULT_RATING, row[ROW_INDEX_INSTRUCTIONS], category_id, glass_id, types_id,))
    return c.lastrowid


def insert_and_map_ingredients(db, cocktail_id, row):
    """
    Parses the ingredients for the cocktail.
    After inserting the ingredient into the tables, it will also create a recipe for the cocktails itself

    :param db:          The database handle to create a cursor on
    :param cocktail_id: The ID of the cocktial, for which the ingredients should be parsed
    :param row:         read line from the CSV file
    """
    c = db.cursor()

    # row[9] is the first ingredient, row[23] the last
    # row[24] are the instructions
    # row[25] - row[39] are measurements
    for x in range(ROW_INDEX_INGREDIENT_BEGIN, ROW_INDEX_INGREDIENT_END):
        if row[x] is not "":
            print("x is: %s, ingredient is: %s, measurement is: %s, cocktail_id is %d" %
                  (x, row[x], row[x+MEASUREMENT_STEP], cocktail_id))
            ingredient_id = insert_new_if_not_present(
                db, sql_query_for_ingredient_id, sql_insert_new_ingredient, row[x])
            print("Ingredient id of %s is %s" % (row[x], ingredient_id))
            c.execute(sql_insert_new_recipe_part,
                      (cocktail_id, ingredient_id, row[x+MEASUREMENT_STEP],))


def parse_csv_row(db, row):
    """
    Parses a row from the CSV file and stores the cocktail in the SQLite DB

    :param db:  The database handle to create a cursor on
    :param row: The line that was read from the CSV file
    """
    # these values are always present
    glass_id = insert_new_if_not_present(
        db, sql_query_for_glass_id, sql_insert_new_glass, row[ROW_INDEX_GLASSES])
    types_id = insert_new_if_not_present(
        db, sql_query_for_type_id, sql_insert_new_type, row[ROW_INDEX_TYPES])

    # these values might be present
    category_id = None
    if row[ROW_INDEX_CATEGORIES] is not "":
        category_id = insert_new_if_not_present(
            db, sql_query_for_category_id, sql_insert_new_category, row[ROW_INDEX_CATEGORIES])

    # store the cocktail
    cocktail_id = insert_new_cocktail(db, row, glass_id, types_id, category_id)

    # after the cocktail_id is known, the ingredients can be stored and mapped
    insert_and_map_ingredients(db, cocktail_id, row)



# create a new database or connect to an existing one
db = sqlite3.connect('drinksDB.db')
create_db_tables(db)


with open('./all_drinks.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    i = 0
    for row in readCSV:
        # skip the first line
        i = i+1
        if i is 1:
            continue
        print(row)
        parse_csv_row(db, row)

# close the databse connection
db.close()
