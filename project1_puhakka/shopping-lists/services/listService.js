import { executeQuery } from "../database/database.js";

const create = async (name) => {
    await executeQuery(
      "INSERT INTO shopping_lists (name) VALUES ($1);",
      name
    );
};

const addItem = async (name, id) => {
    await executeQuery(
      "INSERT INTO shopping_list_items (name, shopping_list_id) VALUES ($1, $2);",
      name, id
    );
};

const findAllActive = async () => {
    let result = await executeQuery("SELECT * FROM shopping_lists WHERE active = True;");
    return result.rows;
};

const deactivateById = async (id) => {
    let result = await executeQuery("UPDATE shopping_lists SET active = false WHERE id = ($1);", 
    id);
    return result.rows;
};

const collectItemById = async (id) => {
    let result = await executeQuery("UPDATE shopping_list_items SET collected = true WHERE id = ($1);", 
    id);
    return result.rows;
};

const getItems = async (id) => {
    let result = await executeQuery("SELECT * FROM shopping_list_items WHERE shopping_list_id = ($1);", 
    id);
    return result.rows;
};

const findById = async (id) => {
    let result = await executeQuery("SELECT * FROM shopping_lists WHERE id = ($1);", 
    id);
    return result.rows[0];
};
   
const countLists = async() => {
  const result = await executeQuery("SELECT COUNT(*) FROM shopping_lists");
  return result.rows[0].count;
};

const countItems = async() => {
    const result = await executeQuery("SELECT COUNT(*) FROM shopping_list_items");
    return result.rows[0].count;
  };


export {create, countLists, countItems, findAllActive, deactivateById, findById, getItems, addItem, collectItemById}