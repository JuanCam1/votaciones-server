import { Router } from "express";
import { getEstadoAllStateController } from "../controllers/estado.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";
const routerEstado = Router();

routerEstado.get(
  "/getEstadoState/",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  getEstadoAllStateController
);

export default routerEstado;
