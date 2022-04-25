import * as questionService from "../../services/questionService.js";


const getRandomQueston = async ({ response }) => {
    let questions = await questionService.allQuestions();
    if (questions.length > 0) {
        const question = questions[Math.floor(Math.random()*questions.length)];
        const options = await questionService.getQuestionOptions(question.id)
        let op = []

        options.forEach((option) => {
            op.push({optionId: option.id,
                optionText: option.option_text})
        })

        const data = {
            questionId: question.id,
            questionText: question.question_text,
            answerOptions: op
        }
        response.body = data;
    } else {
        response.body = {};
    }
};

const postAnswer = async ({ response, request }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    let value = false;
    const que = await questionService.getQuestionOptionById(document.optionId)

    if (que) {
        const answ = await questionService.getOption(document.questionId, que.option_text)

        if (answ && answ.is_correct) {
            value = true;
    }

    }
  
    response.body = { correct: value };
  };

export { getRandomQueston, postAnswer };