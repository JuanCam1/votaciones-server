import { matchedData } from "express-validator";
import { createToken } from "../../services/jwt.js";
import { sendErrorResponse } from "../../utils/sendResponse.js";
import { getByEmail } from "../models/login.model.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const data = matchedData(req);

  try {
    const [[[user]]] = await getByEmail(data.correo_usuario);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database");

    if (user.estado_id == 2) return sendErrorResponse(res, 401, 101, "User Inactivo");

    switch (user.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database");
      case -2:
        return sendErrorResponse(res, 404, 106, "User not found");
      case -3:
        return sendErrorResponse(res, 404, 301, "Error in database");
    }

    const checkPassword = bcrypt.compareSync(data.password_usuario, user.password_usuario);

    if (!checkPassword) {
      return sendErrorResponse(res, 401, 106, "Datos incorrectos");
    }

    return res.status(200).send(JSON.stringify(createToken(user), null, 3));
  } catch (err) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
