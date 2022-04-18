import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions@v3.2.3/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";

const app = new Application();

const session = new Session();
app.use(session.initMiddleware());
app.use(renderMiddleware);

const router = new Router();


const listItems = async({ render, state }) => {
  let items = await state.session.get("items");
  if (!items) {
    items = [];
    await state.session.set("items", items);
  }
  render("index.eta", {items: items});
};

const addItem = async ({ request, response, state }) => {
  const body = request.body();
  const params = await body.value;

  let items = await state.session.get("items");
  if (!items) {
    items = [];
  }

  items.push(params.get("item"));
  await state.session.set("items", items);
  response.redirect("/");
};

router.get("/", listItems);
router.post("/", addItem);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
