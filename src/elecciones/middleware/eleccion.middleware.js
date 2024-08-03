import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateCreateEleccion = [
  check("nombre_eleccion")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("descripcion_eleccion")
    .isLength({ min: 2, max: 800 })
    .withMessage("Must be between 2 and 800 characters"),
  check("fecha_ini_eleccion")
    .isLength({ min: 2, max: 40 })
    .withMessage("Must be between 2 and 40 characters"),
  check("fecha_fin_eleccion")
    .isLength({ min: 2, max: 40 })
    .withMessage("Must be between 2 and 40 characters"),
  check("hora_ini_eleccion")
    .isLength({ min: 2, max: 40 })
    .withMessage("Must be between 2 and 40 characters"),
  check("hora_fin_eleccion")
    .isLength({ min: 2, max: 40 })
    .withMessage("Must be between 2 and 40 characters"),
  check("estado_id").exists()
];

export const validateUpdateEleccion = [
  check("idEleccion").exists(),
  check("id_eleccion").optional(),
  check("nombre_eleccion").optional(),
  check("descripcion_eleccion").optional(),
  check("fecha_ini_eleccion").optional(),
  check("fecha_fin_eleccion").optional(),
  check("hora_ini_eleccion").optional(),
  check("hora_fin_eleccion").optional(),
];

export const validateEleccionById = [
  check("idEleccion").exists().withMessage("Eleccion id is required")
];

export const validateEleccionState = [
  check("stateEleccion").exists().withMessage("Eleccion state is required")
];

const fields = ["nombre_eleccion", "nombre_estado"];
export const validateEleccionAll = [
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

export const handleValidationErrorsEleccion = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Eleccion");
  next();
};
