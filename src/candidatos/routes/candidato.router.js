import { Router } from "express";
import {
  handleValidationErrorsCandidato,
  validateCandidatoAll,
  validateCandidatoById,
  validateCandidatoState,
  validateCreateCandidato,
  validateFileNameImage,
  validateUpdateCandidato
} from "../middleware/candidato.middleware.js";
import {
  changeStateCandidatoController,
  createCandidatoController,
  getCandidatoAllController,
  getCandidatoAllStateController,
  getCandidatoByIdController,
  getDownloadExcelCandidatoController,
  getImageCandidato,
  updateCandidatoController
} from "../controllers/candidato.controller.js";
import path from "path";
import multer from "multer";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const storagePhoto = multer.diskStorage({
  destination: "uploads/photos/candidatos",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storagePhoto,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
  }
});

const routerCandidato = Router();

routerCandidato.get(
  "/getCandidatoAllState/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateCandidatoState,
  handleValidationErrorsCandidato,
  getCandidatoAllStateController
);

routerCandidato.post(
  "/createCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("foto_candidato"),
  validateCreateCandidato,
  handleValidationErrorsCandidato,
  createCandidatoController
);

routerCandidato.post(
  "/getCandidatoAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateCandidatoAll,
  handleValidationErrorsCandidato,
  getCandidatoAllController
);

routerCandidato.get(
  "/getCandidatoById/:idCandidato",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateCandidatoById,
  handleValidationErrorsCandidato,
  getCandidatoByIdController
);

routerCandidato.get(
  "/changeStateCandidato/:idCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateCandidatoById,
  handleValidationErrorsCandidato,
  changeStateCandidatoController
);

routerCandidato.patch(
  "/updateCandidato/:idCandidato",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("foto_candidato"),
  validateCandidatoById,
  validateUpdateCandidato,
  handleValidationErrorsCandidato,
  updateCandidatoController
);

routerCandidato.get(
  "/getDownloadExcelCandidato/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateCandidatoState,
  handleValidationErrorsCandidato,
  getDownloadExcelCandidatoController
);

routerCandidato.get(
  "/getImage/:fileName",
  validateFileNameImage,
  handleValidationErrorsCandidato,
  getImageCandidato
);

export default routerCandidato;
