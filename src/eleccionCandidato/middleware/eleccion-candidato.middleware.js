import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateCreateEleccionCandidato = [
  check("eleccion_id").exists(),
  check("candidatos_id").exists(),
  check("estado_id").exists()
];

export const validateUpdateEleccionCandidato = [
  check("id_eleccion_candidato").optional(),
  check("eleccion_id").exists(),
  check("candidato_id").exists()
];

export const validateEleccionCandidatoById = [
  check("idEleccionCandidato").exists().withMessage("EleccionCandidato id is required")
];

export const validateEleccionCandidatoState = [
  check("state").exists().withMessage("state is required")
];

export const validateIdEleccion = [
  check("id_eleccion").exists().withMessage("id_eleccion is required")
];

const fields = [
  "nombre_eleccion",
  "cedula_candidato",
  "nombre_candidato"
];

export const validateEleccionCandidatoAll = [
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

export const handleValidationErrorsEleccionCandidato = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data EleccionCandidato");
  next();
};
