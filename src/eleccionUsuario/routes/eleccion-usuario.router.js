import { Router } from "express";

import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";
import { changeStateEleccionUsuarioController, createEleccionUsuarioController, getEleccionUsuarioAllController, getEleccionUsuarioAllStateController, getEleccionUsuarioByIdController, updateEleccionUsuarioController, usuariosPorEleccionUsuarioController } from "../controllers/eleccion-usuario.controller.js";
import { handleValidationErrorsEleccionUsuario, validateCreateEleccionUsuario, validateEleccionUsuarioAll, validateEleccionUsuarioById, validateEleccionUsuarioState, validateIdEleccion, validateUpdateEleccionUsuario } from "../middleware/eleccion-usuario.middleware.js";

const routerEleccionUsuario = Router();

routerEleccionUsuario.get(
  "/getEleccionUsuarioState/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionUsuarioState,
  handleValidationErrorsEleccionUsuario,
  getEleccionUsuarioAllStateController
);

routerEleccionUsuario.post(
  "/createEleccionUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateEleccionUsuario,
  handleValidationErrorsEleccionUsuario,
  createEleccionUsuarioController
);

routerEleccionUsuario.post(
  "/getEleccionUsuarioAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionUsuarioAll,
  handleValidationErrorsEleccionUsuario,
  getEleccionUsuarioAllController
);

routerEleccionUsuario.get(
  "/getEleccionUsuarioById/:idEleccionUsuario",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionUsuarioById,
  handleValidationErrorsEleccionUsuario,
  getEleccionUsuarioByIdController
);

routerEleccionUsuario.get(
  "/changeStateEleccionUsuario/:idEleccionUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionUsuarioById,
  handleValidationErrorsEleccionUsuario,
  changeStateEleccionUsuarioController
);

routerEleccionUsuario.patch(
  "/updateEleccionUsuario/:idEleccionUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionUsuarioById,
  validateUpdateEleccionUsuario,
  handleValidationErrorsEleccionUsuario,
  updateEleccionUsuarioController
);

routerEleccionUsuario.post(
  "/UsuariosPorEleccionUsuario",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateIdEleccion,
  validateEleccionUsuarioState,
  handleValidationErrorsEleccionUsuario,
  usuariosPorEleccionUsuarioController
);

export default routerEleccionUsuario;
