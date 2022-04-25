import { executeQuery } from "../database/database.js";


const getTopics = async () => {
    let result = await executeQuery("SELECT COUNT(*) FROM topics;");
    return result.rows[0].count;
};

const getQuestions = async () => {
  let result = await executeQuery("SELECT COUNT(*) FROM questions;");
  return result.rows[0].count;
};

const getAnswers = async () => {
  let result = await executeQuery("SELECT COUNT(*) FROM question_answers;");
  return result.rows[0].count;
};

export {getQuestions, getAnswers, getTopics}