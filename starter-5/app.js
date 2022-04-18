import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions@v3.2.3/mod.ts";

const app = new Application();
const session = new Session();
app.use(session.initMiddleware());

const router = new Router();

const hello = async ({ cookies, response, state }) => {
  let name = await state.session.get("name");
  if (name) {
    response.body = `Hello ${name}!`;
  } else {
    response.body = "Hello anonymous!";
  }
};

const hello2 = async ({ response, state, request }) => {
  const body = request.body();
  const params = await body.value;
  await state.session.set("name", params.get("name"));
  response.redirect("/");
};

router.get("/", hello);
router.post("/", hello2);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
