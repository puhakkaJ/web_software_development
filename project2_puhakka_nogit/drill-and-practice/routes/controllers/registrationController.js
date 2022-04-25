import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)]
};


const register = async ({ request, response, render, state }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const data = {
      email: params.get("email"),
      password: params.get("password"),
      errors: [],
      user: await state.session.get("user")
    }

    const [passes, errors] = await validasaur.validate(data, validationRules);

    if (passes) {
      await userService.addUser(
        params.get("email"),
        await bcrypt.hash(params.get("password")),
      );
    
      response.redirect("/auth/login");
    } else {
      data.errors = errors;
      render("registration.eta", data);
    }
  
    
  };
  
  const showRegistrationForm = async ({ render, state }) => {
    const data = {
      email: "",
      password: "",
      errors: [],
      user: await state.session.get("user")
    }

    render("registration.eta", data);
  };


export { register, showRegistrationForm };