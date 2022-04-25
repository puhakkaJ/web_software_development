import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

import { validasaur } from "../../deps.js";

const validationRulesForOption = {
    option_text: [validasaur.required, validasaur.minLength(1)],
};

const showQuestion = async ({ render, params, state }) => {
    const question = await questionService.getQuestion(params.qid);
    const topic = await topicService.getTopic(params.id);
    const corrects = await questionService.getRightAnswer(params.qid);

    let data = {
        question: question,
        options: await questionService.getQuestionOptions(params.qid),
        topic: topic,
        option_text: "",
        is_correct: false,
        no_correct_ans: (corrects.length == 0) ? true : false,
        errors: null,
        user: await state.session.get("user")
    }
  
    return render("question.eta", data);
};

const addOption = async ({ request, response, state, render, params }) => {
    const body = request.body({ type: "form" });
    const params2 = await body.value;
    const user = await state.session.get("user");
    const question = await questionService.getQuestion(params.qid);
    const topic = await topicService.getTopic(params.id);
    const corrects = await questionService.getRightAnswer(params.qid);

    let data = {
        options: await questionService.getQuestionOptions(params.qid),
        question: question,
        topic: topic,
        option_text: params2.get("option_text"),
        is_correct: ((params2.get("is_correct") != undefined) ? true : false),
        no_correct_ans: (corrects.length == 0) ? true : false,
        errors: null,
        user: await state.session.get("user")
    }

    const [passes, errors] = await validasaur.validate(data, validationRulesForOption);

    if (passes) {
        if (user) {
            await questionService.addOption(params2.get("option_text"), params.qid, ((params2.get("is_correct") != undefined) ? true : false))
          
            return response.redirect(`/topics/${params.id}/questions/${params.qid}`);
        } else {
            console.log("Only registered users can add new topics!");
            return response.redirect(`/topics/${params.id}/questions/${params.qid}`);
        }
    } else {
        data.errors = errors;
        return render("question.eta", data);
    }
};

const deleteQuestion = async ({ response, state, params }) => {
    const user = await state.session.get("user")

    if (user) {
        await questionService.deleteQuestionsById(params.qid);
        await questionService.deleteQuestionAnswers(params.qid);
        
        return response.redirect(`/topics/${params.id}`);
    } else {
        console.log("Only registered users can remove questions")
        return response.redirect(`/topics/${params.id}`);
    }
};

const deleteOption = async ({ response, state, params }) => {
    const user = await state.session.get("user")

    if (user) {
        await questionService.deleteQuestionAnswers(params.oid);
        await questionService.deleteOptionsById(params.oid);
        
        return response.redirect(`/topics/${params.id}/questions/${params.qid}`);
    } else {
        console.log("Only registered users can remove options")
        return response.redirect(`/topics/${params.id}/questions/${params.qid}`);
    }
};

export { showQuestion, addOption, deleteQuestion, deleteOption };