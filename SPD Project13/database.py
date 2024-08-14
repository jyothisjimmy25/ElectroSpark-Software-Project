import sqlite3 as sql

# Connect to the database
con = sql.connect('Electrospark.db')

# Create a cursor object
cur = con.cursor()

# Create the new users table with additional columns
create_users_table_sql = '''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    dob DATE NOT NULL,
    role TEXT NOT NULL
);
'''

cur.execute(create_users_table_sql)

# Commit changes
con.commit()

# Close the connection
con.close()
