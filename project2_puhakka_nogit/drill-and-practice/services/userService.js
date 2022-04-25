import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
  await executeQuery(
    `INSERT INTO users
      (email, password)
        VALUES ($1, $2)`,
    email,
    password,
  );
};

const findUserByEmail = async (email) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );

  return result.rows;
};

const deleteUser = async (email) => {
  await executeQuery(
    `DELETE FROM users WHERE email = $1`,
    email);
};

export { addUser, findUserByEmail, deleteUser };