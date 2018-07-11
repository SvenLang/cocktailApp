import sqlite3

# create a new database ot connect to an existing one
db = sqlite3.connect('drinksDB.db')
cursor = db.cursor()

# create the three tables so that the csv data can be inserted automatically

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
# examples: shots, cocktail ,beer
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
sql_create_recipe_table = """CREATE TABLE IF NOT EXISTS recipies (
    id integer PRIMARY KEY AUTOINCREMENT,
    cocktail_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    measure text,
    FOREIGN KEY (cocktail_id) REFERENCES cocktails (id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id)
);"""

cursor.execute(sql_create_ingredients_table)
cursor.execute(sql_create_glasses_table)
cursor.execute(sql_create_types_table)
cursor.execute(sql_create_categories_table)
cursor.execute(sql_create_cocktail_table)
cursor.execute(sql_create_recipe_table)

# close the databse connection
db.close()
