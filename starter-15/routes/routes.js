import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import * as formController from "./controllers/formController.js";

const router = new Router();

router.get("/", formController.viewForm);
router.post("/", formController.addFile);
router.post("/files", formController.files);



export { router };
