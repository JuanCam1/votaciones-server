import { Router } from "express";
import {
  handleValidationErrorsUsuario,
  validateCreateUsuario,
  validateFileNameImage,
  validateUpdateNavbarUsuario,
  validateUpdateUsuario,
  validateUsuarioAll,
  validateUsuarioById,
  validateUsuarioState
} from "../middleware/usuario.middleware.js";
import {
  changeStateUsuarioController,
  createUsuarioController,
  getDownloadExcelUsuarioController,
  getImageUsuario,
  getUsuarioAllController,
  getUsuarioAllStateController,
  getUsuarioByIdController,
  updateNavbarUsuarioController,
  updateUsuarioController
} from "../controllers/usuario.controller.js";
import path from "path";
import multer from "multer";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const storagePhoto = multer.diskStorage({
  destination: "uploads/photos/usuarios",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storagePhoto,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png,webp)"));
    }
  }
});

const routerUsuario = Router();

routerUsuario.get(
  "/getUsuarioAllState/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateUsuarioState,
  handleValidationErrorsUsuario,
  getUsuarioAllStateController
);

routerUsuario.post(
  "/createUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("foto_usuario"),
  validateCreateUsuario,
  handleValidationErrorsUsuario,
  createUsuarioController
);

routerUsuario.post(
  "/getUsuarioAll",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateUsuarioAll,
  handleValidationErrorsUsuario,
  getUsuarioAllController
);

routerUsuario.get(
  "/getUsuarioById/:idUsuario",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateUsuarioById,
  handleValidationErrorsUsuario,
  getUsuarioByIdController
);

routerUsuario.get(
  "/changeStateUsuario/:idUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  validateUsuarioById,
  handleValidationErrorsUsuario,
  changeStateUsuarioController
);

routerUsuario.patch(
  "/updateUsuario/:idUsuario",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("foto_usuario"),
  validateUsuarioById,
  validateUpdateUsuario,
  handleValidationErrorsUsuario,
  updateUsuarioController
);

routerUsuario.get(
  "/getDownloadExcelUsuario/:state",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateUsuarioState,
  handleValidationErrorsUsuario,
  getDownloadExcelUsuarioController
);

routerUsuario.patch(
  "/updateNavbarUsuario/:idUsuario",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  upload.single("foto_usuario"),
  validateUsuarioById,
  validateUpdateNavbarUsuario,
  handleValidationErrorsUsuario,
  updateNavbarUsuarioController
);

routerUsuario.get(
  "/getImage/:fileName",
  ensureJWTAuth,
  hasType(["Administrador", "Gestor", "Jurado"]),
  validateFileNameImage,
  handleValidationErrorsUsuario,
  getImageUsuario
);

export default routerUsuario;
