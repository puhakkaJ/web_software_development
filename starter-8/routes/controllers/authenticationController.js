import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import * as userService from "../../services/userService.js";

const showRegistrationForm = ({ render }) => {
  render("register.eta");
};

const showAccounts = async ({ render, state }) => {
  const userId = (await state.session.get("user")).id;
  const accounts = await userService.findAccounts(
    userId,
  );
  render("accounts.eta", {accounts: accounts});
};

const withdraw = async ({ response, request, state, params }) => {
  const body = request.body();
  const params2 = await body.value;
  const userId = (await state.session.get("user")).id;
  if (await userService.hasAccess(userId, params.id)) {
    const account = await userService.findAccount(
      params.id
    );
    const new1 = Number(account.balance) - Number(params2.get("amount"));
    if (new1 < 0) {
      response.status = 401;
      return;
    } else {
      await userService.setBalance(params.id, new1);
      return response.redirect("/accounts");
    }
  } else {
    response.status = 401;
    return;
  }
};

const deposit = async ({ response, request, state, params }) => {
  const body = request.body();
  const params2 = await body.value;
  const userId = (await state.session.get("user")).id;
  if (await userService.hasAccess(userId, params.id)) {
    const account = await userService.findAccount(
      params.id
    );
    const new1 = Number(account.balance) + Number(params2.get("amount"));
    await userService.setBalance(params.id, new1);
    return response.redirect("/accounts");
  } else {
    response.status = 401;
    return;
  }
};


const showAccount = async ({ render, state, params }) => {
  const account = await userService.findAccount(
    params.get("id"),
  );
  render("accounts.eta", {name: account.name, balance: account.balance, id: account.id});
};

const postAccounts = async ({ request, response, state }) => {
  const body = request.body();
  const params = await body.value;

  const name = params.get("name");

  const userId = (await state.session.get("user")).id;

  await userService.newAccount(name,
    userId,
  );
  response.redirect("/accounts");
};



const postRegistrationForm = async ({ request, response }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");
  const verification = params.get("verification");

  if (password !== verification) {
    response.body = "The entered passwords did not match";
    return;
  }

  const existingUsers = await userService.findUsersWithEmail(email);
  if (existingUsers.rows.length > 0) {
    response.body = "The email is already reserved.";
    return;
  }

  const hash = await bcrypt.hash(password);
  await userService.addUser(email, hash);
  response.redirect("/auth/login");
};

const postLoginForm = async ({ request, response, state }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  const existingUsers = await userService.findUsersWithEmail(email);
  if (existingUsers.rows.length === 0) {
    response.status = 401;
    return;
  }

  // take the first row from the results
  const userObj = existingUsers.rows[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    response.status = 401;
    return;
  }

  await state.session.set("authenticated", true);
  await state.session.set("user", {
    id: userObj.id,
    email: userObj.email,
  });
  response.redirect("/accounts");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export {
  postLoginForm,
  postRegistrationForm,
  showLoginForm,
  showRegistrationForm,
  showAccounts,
  postAccounts,
  showAccount,
  deposit,
  withdraw
};
