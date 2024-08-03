import { Router } from "express";
import {
  createVotoUsuario,
  createVotoVotante,
  handleValidationErrorsVotacion,
  validateIdUsuario,
  validateIdVotante,
  validateTokenUsuario,
  validateTokenVotacion,
  validateUsuarioVotacion,
  validateVotanteVotacion
} from "../middleware/votacion.middleware.js";
import {
  createVotoUsuarioController,
  createVotoVotanteController,
  eleccionByIdUsuarioController,
  eleccionByIdVotanteController,
  getUsuarioByCedulaCorreoController,
  getVotanteByCedulaFechaController,
  validateTokenUsuarioController,
  validateTokenVotanteController
} from "../controllers/votacion.controller.js";

const routerVotacion = Router();

routerVotacion.post(
  "/getVotanteByCedulaFecha",
  validateVotanteVotacion,
  handleValidationErrorsVotacion,
  getVotanteByCedulaFechaController
);

routerVotacion.post(
  "/getUsuarioByCorreoCedula",
  validateUsuarioVotacion,
  handleValidationErrorsVotacion,
  getUsuarioByCedulaCorreoController
);

routerVotacion.post(
  "/validateTokenVotante",
  validateTokenVotacion,
  handleValidationErrorsVotacion,
  validateTokenVotanteController
);

routerVotacion.post(
  "/validateTokenUsuario",
  validateTokenUsuario,
  handleValidationErrorsVotacion,
  validateTokenUsuarioController
);

routerVotacion.post(
  "/createVotoVotante",
  createVotoVotante,
  handleValidationErrorsVotacion,
  createVotoVotanteController
);

routerVotacion.post(
  "/createVotoUsuario",
  createVotoUsuario,
  handleValidationErrorsVotacion,
  createVotoUsuarioController
);

routerVotacion.get(
  "/eleccionesIsVotante/:id_votante",
  validateIdVotante,
  handleValidationErrorsVotacion,
  eleccionByIdVotanteController
);

routerVotacion.get(
  "/eleccionesIsUsuario/:id_usuario",
  validateIdUsuario,
  handleValidationErrorsVotacion,
  eleccionByIdUsuarioController
);

export default routerVotacion;
