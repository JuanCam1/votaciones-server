import { Router } from "express";
import { handleValidationErrorsLogin, validateLogin } from "../middleware/login.middleware.js";
import { login } from "../controllers/login.controller.js";

const routerLogin = Router();

routerLogin.post(
  "/",
  validateLogin,
  handleValidationErrorsLogin,
  login
);


export default routerLogin;
