CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('customer','staff','admin')));
