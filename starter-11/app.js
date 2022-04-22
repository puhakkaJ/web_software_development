import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

const showForm = ({ render }) => {
  render("index.eta", { errors: [], name: "", yearOfBirth: "" });
};

const submitForm = async ({ request, response, render }) => {
  const body = request.body();
  const params = await body.value;

  const errors = [];

  let name = params.has("name") ? params.get("name") : "";
  let yearOfBirth = params.has("yearOfBirth") ? params.get("yearOfBirth") : "";

  if (!params.has("name") || params.get("name").length < 4) {
    errors.push("Invalid name");
  }

  if (
    !params.has("yearOfBirth") ||
    Number(params.get("yearOfBirth")).toString() !== params.get("yearOfBirth")
  ) {
    errors.push("Invalid year of birth");
  }

  if (
    Number(params.get("yearOfBirth")) < 1900 ||
    Number(params.get("yearOfBirth")) > 2000
  ) {
    errors.push("Year of birth should be between 1900 and 2000");
  }

  if (errors.length === 0) {
    // could store data
    response.redirect("/");
  } else {
    render("index.eta", {
      errors: errors,
      name: name,
      yearOfBirth: yearOfBirth,
    });
  }
};

router.get("/", showForm);
router.post("/", submitForm);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
