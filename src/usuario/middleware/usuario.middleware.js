import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateCreateUsuario = [
  check("nombre_usuario")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2 and 255 characters"),
  check("lastname_usuario")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2 and 255 characters"),
  check("correo_usuario")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2 and 255 characters"),
  check("password_usuario")
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2 and 255 characters"),
  check("cedula_usuario")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 2 and 100 characters"),
  check("role_id").exists(),
  check("estado_id").exists()
];

export const validateUpdateNavbarUsuario = [
  check("idUsuario").exists("User id is required"),
  check("id_usuario").optional(),
  check("password_usuario").optional()
];

export const validateUpdateUsuario = [
  check("idUsuario").exists(),
  check("id_usuario").exists(),
  check("nombre_usuario").optional(),
  check("lastname_usuario").optional(),
  check("correo_usuario").optional(),
  check("password_usuario").optional(),
  check("cedula_usuario").optional(),
  check("role_id").exists()
];

export const validateFileNameImage = [
  check("fileName").exists().withMessage("File name is required")
];

export const validateUsuarioById = [
  check("idUsuario").exists().withMessage("Usuario id is required")
];

export const validateUsuarioState = [
  check("state").exists().withMessage("Usuario state is required")
];

const fields = [
  "cedula_usuario",
  "nombre_usuario",
  "lastname_usuario",
  "correo_usuario",
  "nombre_estado",
  "nombre_role"
];
export const validateUsuarioAll = [
  check("limit").optional().isInt({ min: 1 }).withMessage("Should be an integer greater than 0"),
  check("offset").optional().isInt({ min: 0 }).withMessage("Should be an integer"),
  check("order")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Should be an integer between 0 and 1"),
  check("order_by")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Must be between 1 and 255 characters")
    .custom((value) => {
      if (!fields.includes(value)) throw new Error("Not a valid field");
      else return true;
    })
    .trim(),
  check("filter")
    .optional()
    .custom((value) => {
      if (!value) {
        throw new Error("Filter is not a valid ");
      }

      const operators = ["=", "!=", ">", "<", ">=", "<=", "LIKE"];

      if (fields.includes(value)) {
        throw new Error(`Not a valid field: ${JSON.stringify(value)}`);
      }
      if (operators.includes(value)) {
        throw new Error(`Not a valid operator: ${JSON.stringify(value)}`);
      }
      return true;
    })
];

export const handleValidationErrorsUsuario = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Usuario", req, null);
  next();
};
