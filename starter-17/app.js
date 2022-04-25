import { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

router.get("/", ({ render }) => render("index.eta"));
router.get("/forms", ({ render }) => render("forms.eta"));

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
