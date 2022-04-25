import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

import { validasaur } from "../../deps.js";

const validationRulesForTopic = {
    name: [validasaur.required, validasaur.minLength(1)],
};

const validationRulesForQuestion = {
    question_text: [validasaur.required, validasaur.minLength(1)],
};


const allTopics = async ({render, state}) => {
    let topics = await topicService.allTopics();
    const data = {
        topics: topics.sort(function(a,b){
            return a.name.localeCompare(b.name);}),
        admin: (await state.session.get("user")).admin,  
        errors: null,
        name: "",
        user: await state.session.get("user")
    };

    return render("topics.eta", data);
};

const showTopic = async ({ render, params, state }) => {
    let topic = await topicService.getTopic(params.id);

    let data = {
        question_text: "",
        errors: null,
        admin: (await state.session.get("user")).admin,
        questions: await questionService.allQuestionsByTopic(params.id),
        topic: topic,
        user: await state.session.get("user")
    }
  
    return render("topic.eta", data);
};

const addTopic = async ({ request, response, state, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    const user = await state.session.get("user");
    let topics = await topicService.allTopics();

    let data = {
        name: params.get("name"),
        errors: null,
        admin: (await state.session.get("user")).admin,
        topics: topics.sort(function(a,b){
            return a.name.localeCompare(b.name);}),
            user: await state.session.get("user")
    }

    const [passes, errors] = await validasaur.validate(data, validationRulesForTopic);

    if (passes) {
        if (user && user.admin) {
            await topicService.addTopic(params.get("name"), user.id )
            return response.redirect("/topics");
        } else {
            console.log("Only admins can add new topics!");
            return response.redirect("/topics");
        }
    } else {
        data.errors = errors;
        return render("topics.eta", data);
    }
};

const deleteTopic = async ({ response, state, params }) => {
    const user = await state.session.get("user")

    if (user && user.admin) {
        await topicService.deleteTopic(params.id);
        const questions = await questionService.getRelatetQuestions(params.id);
        console.log(questions);
        await questionService.deleteQuestions(params.id);

        for (let i = 0; i < questions.length; i++) {
            await questionService.deleteQuestionChoises(questions[i]);
            await questionService.deleteQuestionAnswers(questions[i]);
        }
        
        return response.redirect("/topics");
    } else {
        console.log("Only admins can remove topics")
        return response.redirect("/topics");
    }
};

const addQuestions = async ({ request, response, state, render, params }) => {
    const body = request.body({ type: "form" });
    const params2 = await body.value;
    const user = await state.session.get("user");

    let data = {
        question_text: params2.get("question_text"),
        errors: null,
        admin: (await state.session.get("user")).admin,
        questions: await questionService.allQuestionsByTopic(params.id),
        topic: await topicService.getTopic(params.id),
        user: await state.session.get("user")
    }

    const [passes, errors] = await validasaur.validate(data, validationRulesForQuestion);

    if (passes) {
        if (user) {
            await topicService.addQuestionToTopic(params2.get("question_text"), params.id, user.id);
            return response.redirect(`/topics/${params.id}`);
        } else {
            console.log("Only registered users can add new topics!");
            return response.redirect(`/topics/${params.id}`);
        }
    } else {
        data.errors = errors;
        return render("topic.eta", data);
    }
};


export { allTopics, showTopic, addTopic, deleteTopic, addQuestions };