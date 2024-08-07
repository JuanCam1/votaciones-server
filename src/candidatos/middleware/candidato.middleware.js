import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateCreateCandidato = [
  check("nombre_candidato")
    .isLength({ min: 2, max: 300 })
    .withMessage("Must be between 2 and 300 characters"),
  check("cedula_candidato")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 2 and 100 characters"),
  check("estado_id").exists()
];

export const validateUpdateCandidato = [
  check("idCandidato").exists(),
  check("id_candidato").optional(),
  check("nombre_candidato").optional(),
  check("cedula_candidato").optional()
];

export const validateFileNameImage = [
  check("fileName").exists().withMessage("File name is required")
];

export const validateCandidatoById = [
  check("idCandidato").exists().withMessage("Candidato id is required")
];

export const validateCandidatoState = [
  check("state").exists().withMessage("Candidato state is required")
];

const fields = ["nombre_candidato", "cedula_candidato", "nombre_estado"];
export const validateCandidatoAll = [
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

export const handleValidationErrorsCandidato = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Candidato", req, null);
  next();
};
