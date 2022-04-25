import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionController from "./controllers/questionController.js";
import * as quizController from "./controllers/quizController.js";

import * as quizApi from "./apis/quizApi.js";


const router = new Router();


router.get("/", mainController.showMain);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.register);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.login);

router.get("/topics", topicController.allTopics);
router.post("/topics", topicController.addTopic);
router.get("/topics/:id", topicController.showTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);
router.post("/topics/:id/questions", topicController.addQuestions);

router.get("/topics/:id/questions/:qid", questionController.showQuestion);
router.post("/topics/:id/questions/:qid/options", questionController.addOption);
router.post("/topics/:id/questions/:qid/delete", questionController.deleteQuestion);
router.post("/topics/:id/questions/:qid/options/:oid/delete", questionController.deleteOption);

router.get("/quiz", quizController.showTopics);
router.get("/quiz/:id", quizController.chooseTopic);
router.get("/quiz/:id/questions/:qid", quizController.showTopic);
router.post("/quiz/:id/questions/:qid/options/:oid", quizController.answer);
router.get("/quiz/:id/questions/:qid/correct", quizController.correct);
router.get("/quiz/:id/questions/:qid/incorrect", quizController.incorrect);

router.get("/api/questions/random", quizApi.getRandomQueston);
router.post("/api/questions/answer", quizApi.postAnswer);















export { router };
