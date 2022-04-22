import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { executeQuery } from "./database/database.js";
import {
  lengthBetween,
  isNumeric,
  required,
  validate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

const validationRules = {
  name: [required, lengthBetween(5, 20)],
  rating: [required, lengthBetween(1, 10), isNumeric],
};

const getData = async (request) => {
  const data = {
    name: "",
    rating: "",
    errors: {},
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.name = params.get("name");
    data.rating = params.get("rating");
  }

  return data;
};

const getSongs = async () => {
  const songs = await executeQuery("SELECT * FROM songs");
  if (!songs) {
    return [];
  }
  return songs.rows;
};

const showForm = async ({ render }) => {
  render("index.eta", { songs: await getSongs(), name: "", rating: "" });
};

const submitForm = async ({ request, response, render }) => {
  const data = await getData(request);
  const [passes, errors] = await validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    render("index.eta", data);
  } else {
    await executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2)",
    data.name, Number(data.rating));
    return response.redirect("/");
  }
};

router.get("/", showForm);
router.post("/", submitForm);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
