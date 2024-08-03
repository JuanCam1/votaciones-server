import { Router } from "express";
import {
  handleValidationErrorsEleccionCandidato,
  validateCreateEleccionCandidato,
  validateEleccionCandidatoAll,
  validateEleccionCandidatoById,
  validateEleccionCandidatoState,
  validateIdEleccion,
  validateUpdateEleccionCandidato
} from "../middleware/eleccion-candidato.middleware.js";
import {
  candidatosPorEleccionCandidatoController,
  changeStateEleccionCandidatoController,
  createEleccionCandidatoController,
  getEleccionCandidatoAllController,
  getEleccionCandidatoAllStateController,
  getEleccionCandidatoByIdController,
  updateEleccionCandidatoController
} from "../controllers/eleccion-candidato.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const routerEleccionCandidato = Router();

routerEleccionCandidato.get(
  "/getEleccionCandidatoState/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionCandidatoState,
  handleValidationErrorsEleccionCandidato,
  getEleccionCandidatoAllStateController
);

routerEleccionCandidato.post(
  "/createEleccionCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateEleccionCandidato,
  handleValidationErrorsEleccionCandidato,
  createEleccionCandidatoController
);

routerEleccionCandidato.post(
  "/getEleccionCandidatoAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionCandidatoAll,
  handleValidationErrorsEleccionCandidato,
  getEleccionCandidatoAllController
);

routerEleccionCandidato.get(
  "/getEleccionCandidatoById/:idEleccionCandidato",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionCandidatoById,
  handleValidationErrorsEleccionCandidato,
  getEleccionCandidatoByIdController
);

routerEleccionCandidato.get(
  "/changeStateEleccionCandidato/:idEleccionCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionCandidatoById,
  handleValidationErrorsEleccionCandidato,
  changeStateEleccionCandidatoController
);

routerEleccionCandidato.patch(
  "/updateEleccionCandidato/:idEleccionCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionCandidatoById,
  validateUpdateEleccionCandidato,
  handleValidationErrorsEleccionCandidato,
  updateEleccionCandidatoController
);

routerEleccionCandidato.post(
  "/candidatosPorEleccionCandidato",
  validateIdEleccion,
  validateEleccionCandidatoState,
  handleValidationErrorsEleccionCandidato,
  candidatosPorEleccionCandidatoController
);

export default routerEleccionCandidato;
