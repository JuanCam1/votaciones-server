import { check, validationResult } from "express-validator";

export const validateLogin = [
  check("correo_usuario")
    .exists()
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("password_usuario")
    .exists()
    .isLength({ min: 2, max: 800 })
    .withMessage("Must be between 2 and 800 characters")
];

export const handleValidationErrorsLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendErrorResponse(res, 400, 201, "Request has invalid data Login");
  next();
};
