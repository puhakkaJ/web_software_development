import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";


const showTopics = async ({ render, cookies, state }) => {
    let topics = await topicService.allTopics();
    const data = {
        topics: topics.sort(function(a,b){
            return a.name.localeCompare(b.name);}),
        not_found: await cookies.get("not_found"),
        user: await state.session.get("user")
    };
    await cookies.set("not_found", null);

    return render("quizTopics.eta", data);
};

const chooseTopic = async ({ response, params, cookies }) => {
    let questions = await questionService.allQuestionsByTopic(params.id);
    if (questions.length > 0) {
        await cookies.set("not_found", null);
        const question = questions[Math.floor(Math.random()*questions.length)];
        return response.redirect(`/quiz/${params.id}/questions/${question.id}`);
    } else {
        await cookies.set("not_found", (await topicService.getTopic(params.id)).name);
        return response.redirect("/quiz");
    }
};

const showTopic = async ({ render, params, state }) => {
    let question = await questionService.getQuestion(params.qid);
    const data = {
        question: question,
        options: await questionService.getQuestionOptions(params.qid),
        topic: await topicService.getTopic(params.id),
        user: await state.session.get("user")
    };

    return render("quizTopic.eta", data);
};

const answer = async ({ state, params, response }) => {
    const user = await state.session.get("user")
    await questionService.answer(user.id, params.qid, params.oid);
    const correct = await questionService.getQuestionOptionById(params.oid);

    if (correct.is_correct) {
        return response.redirect(`/quiz/${params.id}/questions/${params.qid}/correct`)
    } else {
        return response.redirect(`/quiz/${params.id}/questions/${params.qid}/incorrect`)
    }
};

const correct = async ({ render, params, state }) => {
    return render("correct.eta", { topic: await topicService.getTopic(params.id), user: await state.session.get("user") });
};

const incorrect = async ({ render, params, state }) => {
    return render("incorrect.eta", { topic: await topicService.getTopic(params.id),
    correct: await questionService.getRightAnswer(params.qid), user: await state.session.get("user")});
};


export { showTopics, showTopic, chooseTopic, answer, correct, incorrect };