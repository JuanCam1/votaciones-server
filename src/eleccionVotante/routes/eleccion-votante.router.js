import { Router } from "express";
import {
  handleValidationErrorsEleccionVotante,
  validateCreateEleccionVotante,
  validateEleccionVotanteAll,
  validateEleccionVotanteById,
  validateEleccionVotanteByIdEleccionAll,
  validateEleccionVotanteState,
  validateIdEleccion,
  validateUpdateEleccionVotante
} from "../middleware/eleccion-votante.middleware.js";
import {
  changeStateEleccionVotanteController,
  createEleccionVotanteController,
  downloadVotantesPorEleccionVotanteController,
  getEleccionVotanteAllController,
  getEleccionVotanteAllStateController,
  getEleccionVotanteByIdController,
  getEleccionVotanteByIdEleccionAllController,
  updateEleccionVotanteController,
  votantesPorEleccionVotanteController
} from "../controllers/eleccion-votante.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";
const routerEleccionVotante = Router();

routerEleccionVotante.get(
  "/getEleccionVotanteState/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionVotanteState,
  handleValidationErrorsEleccionVotante,
  getEleccionVotanteAllStateController
);

routerEleccionVotante.post(
  "/createEleccionVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateEleccionVotante,
  handleValidationErrorsEleccionVotante,
  createEleccionVotanteController
);

routerEleccionVotante.post(
  "/getEleccionVotanteAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionVotanteAll,
  handleValidationErrorsEleccionVotante,
  getEleccionVotanteAllController
);

routerEleccionVotante.get(
  "/getEleccionVotanteById/:idEleccioneVotante",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionVotanteById,
  handleValidationErrorsEleccionVotante,
  getEleccionVotanteByIdController
);

routerEleccionVotante.get(
  "/changeStateEleccionVotante/:idEleccioneVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionVotanteById,
  handleValidationErrorsEleccionVotante,
  changeStateEleccionVotanteController
);

routerEleccionVotante.patch(
  "/updateEleccionVotante/:idEleccioneVotante",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionVotanteById,
  validateUpdateEleccionVotante,
  handleValidationErrorsEleccionVotante,
  updateEleccionVotanteController
);

routerEleccionVotante.post(
  "/getEleccionVotanteByIdEleccionAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionVotanteByIdEleccionAll,
  handleValidationErrorsEleccionVotante,
  getEleccionVotanteByIdEleccionAllController
);

routerEleccionVotante.get(
  "/votantesPorEleccionVotante/:id_eleccion",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateIdEleccion,
  handleValidationErrorsEleccionVotante,
  votantesPorEleccionVotanteController
);

routerEleccionVotante.get(
  "/getDownloadExcel/:id_eleccion",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateIdEleccion,
  handleValidationErrorsEleccionVotante,
  downloadVotantesPorEleccionVotanteController
);

export default routerEleccionVotante;
