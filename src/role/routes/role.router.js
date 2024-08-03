import { Router } from "express";
import { getRoleAllStateController } from "../controllers/role.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";
const routerRole = Router();

routerRole.get(
  "/getRoleState",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  getRoleAllStateController
);

export default routerRole;
