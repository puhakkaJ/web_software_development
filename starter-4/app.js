import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import * as ticketService from "./services/ticketService.js";

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

let data = {
  tickets: []
};

const hello = ({ response }) => {
  response.body = "Hello!";
};

const tickets = async({ render }) => {
  data.tickets = await ticketService.findAll();
  render("index.eta", data);
};

const tickets2 = async ({ request, response }) => {
  const body = request.body();
  const params = await body.value;

  await ticketService.add(params.get("content"));
  data.tickets = await ticketService.findAll();
  response.redirect("/tickets");
};

const resolve = async ({ request, response, params }) => {
  await ticketService.resolve(params.id);
  response.redirect("/tickets");
};

const del = async ({ request, response, params }) => {
  await ticketService.del(params.id);
  response.redirect("/tickets");
};

router.get("/", hello);
router.get("/tickets", tickets);
router.post("/tickets", tickets2);
router.post("/tickets/:id/resolve", resolve);
router.post("/tickets/:id/delete", del);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
