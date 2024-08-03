import { Router } from "express";
import {
  handleValidationErrorsVotante,
  validateCreateVotante,
  validateUpdateVotante,
  validateVotanteAll,
  validateVotanteById,
  validateVotanteState
} from "../middleware/votante.middleware.js";
import {
  changeStateVotanteController,
  createVotanteController,
  getDownloadExcelVotanteController,
  getVotanteAllController,
  getVotanteAllStateController,
  getVotanteByIdController,
  updateVotanteController
} from "../controllers/votante.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const routerVotantes = Router();

routerVotantes.post(
  "/createVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateVotante,
  handleValidationErrorsVotante,
  createVotanteController
);

routerVotantes.get(
  "/getVotanteState/:stateVotante",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateVotanteState,
  handleValidationErrorsVotante,
  getVotanteAllStateController
);

routerVotantes.post(
  "/getVotanteAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateVotanteAll,
  handleValidationErrorsVotante,
  getVotanteAllController
);

routerVotantes.get(
  "/getVotanteById/:idVotante",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateVotanteById,
  handleValidationErrorsVotante,
  getVotanteByIdController
);

routerVotantes.get(
  "/changeStateVotante/:idVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateVotanteById,
  handleValidationErrorsVotante,
  changeStateVotanteController
);

routerVotantes.patch(
  "/updateVotante/:idVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateVotanteById,
  validateUpdateVotante,
  handleValidationErrorsVotante,
  updateVotanteController
);

routerVotantes.get(
  "/getDownloadExcel/:stateVotante",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateVotanteState,
  handleValidationErrorsVotante,
  getDownloadExcelVotanteController
);

export default routerVotantes;
