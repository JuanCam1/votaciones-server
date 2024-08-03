import { Router } from "express";
import multer from "multer";
import {
  handleValidationErrorsUpload,
  validateEleccionById
} from "../middleware/uploadsFile.middleware.js";
import { uploadFileController } from "../controllers/uploadsFile.controller.js";
import { ensureJWTAuth } from "../../services/jwt.js";
import { hasType } from "../../services/permission.js";

const routerFiles = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

routerFiles.post(
  "/uploadFile/:idEleccion",
  ensureJWTAuth,
  hasType(["Administrador"]),
  upload.single("file"),
  validateEleccionById,
  handleValidationErrorsUpload,
  uploadFileController
);

export default routerFiles;
