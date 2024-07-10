DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, 'name' TEXT, email TEXT, 'password' TEXT, created_at DATE, updated_at DATE);