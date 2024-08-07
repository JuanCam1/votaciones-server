import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateReportes = [check("id_eleccion").exists()];
export const validateReportesJurado = [check("id_jurado").exists()];

const fields = ["id_eleccion"];
export const validateVotantesAll = [
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
  check("id_eleccion").exists()
];
export const handleValidationErrorsReporte = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Reporte", req, null);
  next();
};
