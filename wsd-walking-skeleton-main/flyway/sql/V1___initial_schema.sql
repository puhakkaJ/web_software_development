CREATE TABLE names (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender TEXT NOT NULL,
  message TEXT NOT NULL
);