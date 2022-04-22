import { executeQuery } from "../database/database.js";

const findUsersWithEmail = async (email) => {
  return await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );
};

const findAccounts = async (id) => {
  let result =  await executeQuery(
    "SELECT * FROM accounts WHERE user_id = $1",
    id,
  );
  if (result) {
    return result.rows;
  }

  return [];
};

const setBalance = async (id, balance) => {
  return await executeQuery(
    "UPDATE accounts SET balance = $1 WHERE id = $2",
    balance, id,
  );
};

const findAccount = async (id) => {
  let result =  await executeQuery(
    "SELECT * FROM accounts WHERE id = $1",
    id,
  );
  if (result) {
    return result.rows[0];
  }

  return [];
};

const hasAccess = async (user_id, id) => {
  let result =  await executeQuery(
    "SELECT * FROM accounts WHERE id = $1 AND user_id = $2",
    id, user_id
  );
  if (result.rows.length > 0) {
    return true;
  }

  return false;
};

const newAccount = async (name,id) => {
  return await executeQuery(
    "INSERT INTO accounts (name, user_id) VALUES ($1, $2) ",
    name, id
  );
};

const addUser = async (email, passwordHash) => {
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    passwordHash,
  );
};

export { addUser, findUsersWithEmail, findAccounts, newAccount, findAccount, hasAccess, setBalance };
