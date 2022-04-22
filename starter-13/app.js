import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

const hello = async({ response }) => {
  const result = await executeQuery("SELECT id, name FROM games;");
  response.body = result.rows;
};

const hello2 = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;

  await executeQuery("INSERT INTO games (name) VALUES ($1);", document.name);

  response.body = { status: "success" };
};

const hello3 = async({ response, params }) => {
  const result = await executeQuery("SELECT id, name FROM games WHERE id = $1;", params.id);
  if (result.rows.length > 0) {
    response.body = result.rows[0];
  } else {
    response.body = {};
  }
};

const hello4 = async ({ response, params }) => {
  await executeQuery("DELETE FROM games WHERE id = $1;", params.id);
  await executeQuery("DELETE FROM ratings WHERE game_id = $1;", params.id);

  response.body = { status: "success" };
};

const hello5 = async ({ request, response, params }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;

  await executeQuery("INSERT INTO ratings (rating, game_id) VALUES ($1, $2);", document.rating, params.id);

  response.body = { status: "success" };
};

const hello6 = async ({ response, params }) => {
  const result = await executeQuery("SELECT * FROM ratings WHERE game_id = $1;", params.id);

  if (result.rows.length > 0) {
    response.body = result.rows;
  } else {
    response.body = {};
  }
};

router.get("/games", hello);
router.post("/games", hello2);
router.get("/games/:id", hello3);
router.delete("/games/:id", hello4);
router.post("/games/:id/ratings", hello5);
router.get("/games/:id/ratings", hello6);






app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
