

create table quote (
id INTEGER NOT NULL PRIMARY KEY,
created TEXT NOT NULL,
description TEXT NOT NULL,
price REAL

);

create table quote_item(
id INTEGER NOT NULL PRIMARY KEY,
quote_id INTEGER NOT NULL,
name text NOT NULL,
price REAL,
FOREIGN KEY(quote_id) REFERENCES quote(id)
);


