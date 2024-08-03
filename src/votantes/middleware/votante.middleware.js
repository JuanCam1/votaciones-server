import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateCreateVotante = [
  check("cedula_votante")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 5 and 100 characters"),
  check("fecha_expedicion_votante")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 4 and 80 characters"),
  check("fecha_nacimiento_votante")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 4 and 80 characters"),
  check("fecha_ingreso_votante")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 4 and 80 characters"),
  check("primer_nombre_votante")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 2 and 100 characters"),
  check("segundo_nombre_votante").optional(),
  check("primer_apellido_votante")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 2 and 100 characters"),
  check("segundo_apellido_votante").optional(),
  check("correo_corporativo_votante").isEmail().withMessage("Email no valid"),
  check("correo_personal_votante").isEmail().withMessage("Email no valid"),
  check("telefono_votante")
    .isLength({ min: 2, max: 80 })
    .withMessage("Must be between 2 and 80 characters"),
  check("carrera_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("nombre_dependencia_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("nombre_nivel_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("codigo_cargo_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("nombre_cargo_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("grado_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("codigo_categoria_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("codigo_escalafon_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("nombre_escalafon_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("codigo_municipio_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("nombre_municipio_votante")
    .isLength({ min: 2, max: 200 })
    .withMessage("Must be between 2 and 200 characters"),
  check("estado_id").exists("Estado is required")
];

export const validateUpdateVotante = [
  check("idVotante").exists(),
  check("id_votante").optional(),
  check("cedula_votante").optional(),
  check("fecha_expedicion_votante").optional(),
  check("fecha_nacimiento_votante").optional(),
  check("fecha_ingreso_votante").optional(),
  check("primer_nombre_votante").optional(),
  check("segundo_nombre_votante").optional(),
  check("primer_apellido_votante").optional(),
  check("segundo_apellido_votante").optional(),
  check("correo_corporativo_votante").optional(),
  check("correo_personal_votante").optional(),
  check("telefono_votante").optional(),
  check("carrera_votante").optional(),
  check("nombre_dependencia_votante").optional(),
  check("nombre_nivel_votante").optional(),
  check("codigo_cargo_votante").optional(),
  check("nombre_cargo_votante").optional(),
  check("grado_votante").optional(),
  check("codigo_categoria_votante").optional(),
  check("codigo_escalafon_votante").optional(),
  check("nombre_escalafon_votante").optional(),
  check("codigo_municipio_votante").optional(),
  check("nombre_municipio_votante").optional()
];

export const validateVotanteById = [check("idVotante").exists().withMessage("Votante id is required")];

export const validateVotanteState = [
  check("stateVotante").exists().withMessage("Votante state is required")
];

const fields = [
  "primer_nombre_votante",
  "segundo_nombre_votante",
  "nombre_estado",
  "primer_apellido_votante",
  "segundo_apellido_votante",
  "correo_corporativo_votante",
  "correo_personal_votante",
  "telefono_votante",
  "carrera_votante",
  "nombre_dependencia_votante",
  "nombre_nivel_votante",
  "codigo_cargo_votante",
  "nombre_cargo_votante",
  "grado_votante",
  "codigo_categoria_votante",
  "codigo_escalafon_votante",
  "nombre_escalafon_votante",
  "nombre_municipio_votante",
  "nombre_departamento"
];
export const validateVotanteAll = [
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

export const handleValidationErrorsVotante = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Votante", req, {});
  next();
};
