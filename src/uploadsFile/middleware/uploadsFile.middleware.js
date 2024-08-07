import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateEleccionById = [
  check("idEleccion").exists().withMessage("Eleccion id is required")
];


export const handleValidationErrorsUpload = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Eleccion",req,null);
  next();
};
