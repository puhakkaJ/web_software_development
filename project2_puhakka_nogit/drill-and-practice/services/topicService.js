import { executeQuery } from "../database/database.js";


const allTopics = async () => {
    let result = await executeQuery("SELECT * FROM topics;");
    return result.rows;
};

const getTopic = async (id) => {
    let result = await executeQuery("SELECT * FROM topics WHERE id = $1;", id);
    console.log(result);
    if (result.rows.length > 0) {
        return result.rows[0];
    } else { 
        return {};
    }
};

const addTopic = async (name, userId) => {
    await executeQuery(`INSERT INTO topics (name, user_id) VALUES ($1, $2)`,
      name, userId
    );
};

const addQuestionToTopic = async (question, topic_id, userId) => {
    await executeQuery(
      `INSERT INTO questions (question_text, topic_id, user_id)
          VALUES ($1, $2, $3)`,
          question, topic_id, userId
    );
};

const deleteTopic = async (id) => {
    await executeQuery(
      `DELETE FROM topics WHERE id = $1`, id);
};



export { allTopics, getTopic, addTopic, deleteTopic, addQuestionToTopic }