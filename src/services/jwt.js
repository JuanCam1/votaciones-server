import jwt from "jsonwebtoken";
import moment from "moment";
import { config } from "../../config.js";
import { sendErrorResponse } from "../utils/sendResponse.js";

export function createToken(user) {
  const payload = {
    id_usuario: user.id_usuario,
    nombre_usuario: user.nombre_usuario,
    lastname_usuario: user.lastname_usuario,
    correo_usuario: user.correo_usuario,
    nombre_role: user.nombre_role,
    foto_usuario: user.foto_usuario,
    exp: moment().add(3, "days").unix()
  };
  // exp: moment().add(1, "hours").unix()

  const token = jwt.sign(payload, config.TOKEN_SECRET);

  return {
    success: true,
    data: {
      exp: payload.exp,
      token: token,
      payload: {
        id_usuario: user.id_usuario,
        nombre_usuario: `${user.nombre_usuario} ${user.lastname_usuario}`,
        correo_usuario: user.correo_usuario,
        foto_usuario: user.foto_usuario,
        role_i: user.role_id,
        nombre_role: user.nombre_role,
        estado_id: user.estado_id,
        nombre_estado: user.nombre_estado
      }
    }
  };
}

export function ensureJWTAuth(req, res, next) {
  if (!req.headers.authorization) {
    return sendErrorResponse(res, 403, 101, "Request is missing authorization header", req, null);
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.TOKEN_SECRET);
    if (payload.exp <= moment().unix()) {
      return sendErrorResponse(res, 401, 102, "Expired token", req, null);
    } else {
      req.user = payload;
      next();
    }
  } catch (err) {
    return sendErrorResponse(res, 403, 103, `${err}`.substring(7), req, null);
  }
}
