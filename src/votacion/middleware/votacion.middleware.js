import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/sendResponse.js";

export const validateVotanteVotacion = [
  check("cedula_votante")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 5 and 100 characters"),
  check("fecha_expedicion_votante")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 4 and 80 characters")
];

export const validateUsuarioVotacion = [
  check("correo_usuario")
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be between 5 and 100 characters"),
  check("cedula_usuario")
    .isLength({ min: 4, max: 80 })
    .withMessage("Must be between 4 and 80 characters")
];

export const validateTokenVotacion = [check("id_votante").exists(), check("token").exists()];
export const validateTokenUsuario = [check("id_usuario").exists(), check("token").exists()];
export const validateIdVotante = [check("id_votante").exists()];
export const validateIdUsuario = [check("id_usuario").exists()];

export const createVotoVotante = [
  check("id_eleccione_votante").exists(),
  check("candidato_id").optional(),
  check("eleccion_id").exists(),
  check("votante_id").exists(),
  check("fecha_voto").exists(),
  check("hora_voto").exists(),
  check("voto_blanco").exists()
];

export const createVotoUsuario = [
  check("id_eleccion_usuario").exists(),
  check("candidato_id").optional(),
  check("eleccion_id").exists(),
  check("usuario_id").exists(),
  check("fecha_voto").exists(),
  check("hora_voto").exists(),
  check("voto_blanco").exists()
];

export const handleValidationErrorsVotacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return sendErrorResponse(res, 400, 201, "Request has invalid data Votacion", req, {});
  next();
};
