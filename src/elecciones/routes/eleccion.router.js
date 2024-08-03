import { Router } from "express";
import {
  handleValidationErrorsEleccion,
  validateCreateEleccion,
  validateEleccionAll,
  validateEleccionById,
  validateEleccionState,
  validateUpdateEleccion
} from "../middleware/eleccion.middleware.js";
import {
  changeStateEleccionController,
  createEleccionController,
  getDownloadExcelEleccionController,
  getEleccionAllController,
  getEleccionAllStateController,
  getEleccionByIdController,
  updateEleccionController
} from "../controllers/eleccion.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";
const routerEleccion = Router();

routerEleccion.get(
  "/getEleccionState/:stateEleccion",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionState,
  handleValidationErrorsEleccion,
  getEleccionAllStateController
);

routerEleccion.post(
  "/createEleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCreateEleccion,
  handleValidationErrorsEleccion,
  createEleccionController
);

routerEleccion.post(
  "/getEleccionAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionAll,
  handleValidationErrorsEleccion,
  getEleccionAllController
);

routerEleccion.get(
  "/getEleccionById/:idEleccion",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionById,
  handleValidationErrorsEleccion,
  getEleccionByIdController
);

routerEleccion.get(
  "/changeStateEleccion/:idEleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionById,
  handleValidationErrorsEleccion,
  changeStateEleccionController
);

routerEleccion.patch(
  "/updateEleccion/:idEleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateEleccionById,
  validateUpdateEleccion,
  handleValidationErrorsEleccion,
  updateEleccionController
);

routerEleccion.get(
  "/getDownloadExcelEleccion/:stateEleccion",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateEleccionState,
  handleValidationErrorsEleccion,
  getDownloadExcelEleccionController
);

export default routerEleccion;
