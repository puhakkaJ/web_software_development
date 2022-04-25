import { executeQuery } from "../database/database.js";


const allQuestionsByTopic = async (id) => {
    let result = await executeQuery("SELECT * FROM questions WHERE topic_id = $1;", id);
    return result.rows;
};

const allQuestions = async () => {
    let result = await executeQuery("SELECT * FROM questions;");
    return result.rows;
};

const getOption = async (q_id, o_text) => {
    let result = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1 AND option_text = $2;",
    q_id, o_text);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return [];
    }
};

const getRelatetQuestions = async (id) => {
    let result = await executeQuery("SELECT (id) FROM questions WHERE topic_id = $1;", id);
    console.log(result);
    if (result.rows.length > 0) {
        return result.rows;
    } else {
        return [];
    }
};

const getQuestion = async (id) => {
    let result = await executeQuery("SELECT * FROM questions WHERE id = $1;", id);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return [];
    }
};

const getQuestionOptions = async (id) => {
    let result = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1;", id);
    if (result.rows.length > 0) {
        return result.rows;
    } else {
        return [];
    }
};

const getQuestionOptionById = async (id) => {
    let result = await executeQuery("SELECT * FROM question_answer_options WHERE id = $1;", id);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return [];
    }
};

const getRightAnswer = async (id) => {
    let result = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1 AND is_correct = true;", id);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return [];
    }
};

const addOption = async (option, question_id, correct) => {
    await executeQuery(
      `INSERT INTO question_answer_options
        (option_text, question_id, is_correct)
          VALUES ($1, $2, $3)`,
          option, question_id, correct
    );
};

const answer = async (user_id, question_id, option_id) => {
    await executeQuery(
      `INSERT INTO question_answers
        (user_id, question_id, question_answer_option_id)
          VALUES ($1, $2, $3)`,
          user_id, question_id, option_id
    );
};

const deleteQuestions = async (id) => {
    await executeQuery(
      `DELETE FROM questions WHERE topic_id = $1`, id);
};

const deleteQuestionChoises = async (id) => {
    await executeQuery(
      `DELETE FROM question_answer_options WHERE question_id = $1`, id);
};

const deleteQuestionAnswers = async (id) => {
    await executeQuery(
      `DELETE FROM question_answers WHERE question_answer_option_id = $1`, id);
};

const deleteQuestionsById = async (id) => {
    await executeQuery(
      `DELETE FROM questions WHERE id = $1`, id);
};

const deleteOptionsById = async (id) => {
    await executeQuery(
      `DELETE FROM question_answer_options WHERE id = $1`, id);
};

const deleteQuestionAnswersById = async (id) => {
    await executeQuery(
      `DELETE FROM question_answers WHERE question_answer_option_id = $1`, id);
};


export { deleteQuestions, 
    getRelatetQuestions, 
    deleteQuestionChoises, 
    deleteQuestionAnswers, 
    allQuestionsByTopic,
    getQuestion,
    addOption,
    getQuestionOptions,
    deleteQuestionsById,
    deleteOptionsById,
    deleteQuestionAnswersById,
    answer,
    getQuestionOptionById,
    getRightAnswer,
    allQuestions,
    getOption }