import { Router } from "express";
import { handleValidationErrorsReporte, validateReportes, validateVotantesAll } from "../middleware/reporte.middleware.js";
import { candidatosCountController, getDownloadExcelNoVotaronController, getDownloadExcelVotaronController, getNoVotaronAllController, getVotaronAllController, pudieronVotarController, votaronCountController } from "../controllers/reporte.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const routerReporte = Router();

routerReporte.get(
  "/pudieronVotar/:id_eleccion",
  validateReportes,
  handleValidationErrorsReporte,
  pudieronVotarController
);

routerReporte.get(
  "/votaronCount/:id_eleccion",
  validateReportes,
  handleValidationErrorsReporte,
  votaronCountController
);

routerReporte.get(
  "/candidatosVotos/:id_eleccion",
  validateReportes,
  handleValidationErrorsReporte,
  candidatosCountController
);

routerReporte.post(
  "/getVotaronAll",
  validateVotantesAll,
  handleValidationErrorsReporte,
  getVotaronAllController
);

routerReporte.post(
  "/getNoVotaronAll",
  validateVotantesAll,
  handleValidationErrorsReporte,
  getNoVotaronAllController
);


routerReporte.get(
  "/getDownloadExcelVotaron/:id_eleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateReportes,
  handleValidationErrorsReporte,
  getDownloadExcelVotaronController
);

routerReporte.get(
  "/getDownloadExcelNoVotaron/:id_eleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateReportes,
  handleValidationErrorsReporte,
  getDownloadExcelNoVotaronController
);

export default routerReporte;
