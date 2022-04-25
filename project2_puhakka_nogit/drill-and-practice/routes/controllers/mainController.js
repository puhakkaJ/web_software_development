import * as statisticsService from "../../services/statisticsService.js";


const showMain = async ({ render, state }) => {
  const user = await state.session.get("user"); 

  let data = {
    topic: await statisticsService.getTopics(),
    que: await statisticsService.getQuestions(),
    answ: await statisticsService.getAnswers(),
    user: user
  }
  render("main.eta", data);
};

export { showMain };
