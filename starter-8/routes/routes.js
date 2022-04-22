import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import * as authenticationController from "./controllers/authenticationController.js";
import * as mainController from "./controllers/mainController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/auth/register", authenticationController.showRegistrationForm);
router.post("/auth/register", authenticationController.postRegistrationForm);
router.get("/auth/login", authenticationController.showLoginForm);
router.post("/auth/login", authenticationController.postLoginForm);
router.get("/accounts", authenticationController.showAccounts);
router.post("/accounts", authenticationController.postAccounts);
router.get("/accounts/:id", authenticationController.showAccount);
router.post("/accounts/:id/deposit", authenticationController.deposit);
router.post("/accounts/:id/withdraw", authenticationController.withdraw);



export { router };
