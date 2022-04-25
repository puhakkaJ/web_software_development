import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const login = async ({ request, response, state, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
  
    const userFromDatabase = await userService.findUserByEmail(
      params.get("email"),
    );
    if (userFromDatabase.length != 1) {
      render("login.eta", {errors: {user: [`User ${params.get("email")} does not excit in the database. Register first.`]}, user: await state.session.get("user")});
      return;
    }
  
    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(
      params.get("password"),
      user.password,
    );
  
    if (!passwordMatches) {
      render("login.eta", {errors: { pass: [`Passwords don't match!`]}, user: await state.session.get("user")});
      return;
    }
  
    await state.session.set("user", user);
    response.redirect("/topics");
};

const showLoginForm = async ({ render, state }) => {
    render("login.eta", {user: await state.session.get("user")});
};

export { login, showLoginForm };