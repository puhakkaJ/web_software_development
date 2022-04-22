import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

const hello = async({ response }) => {
  const result = await executeQuery("SELECT id, name, rating FROM songs;");
  response.body = result.rows;
};

const hello2 = async({ response, params }) => {
  const result = await executeQuery("SELECT id, name, rating FROM songs WHERE id = $1;", params.id);
  if (result.rows.length > 0) {
    response.body = result.rows[0];
  } else {
    response.body = {};
  }
};

const hello3 = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;

  await executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2);", document.name, Number(document.rating));

  response.body = { status: "success" };
};

const hello4 = async ({ response, params }) => {
  await executeQuery("DELETE FROM songs WHERE id = $1;", params.id);

  response.body = { status: "success" };
};

router.get("/songs", hello);
router.get("/songs/:id", hello2);

router.post("/songs", hello3);
router.delete("/songs/:id", hello4);


app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
