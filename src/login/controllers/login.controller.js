import { matchedData } from "express-validator";
import { createToken } from "../../services/jwt.js";
import { sendErrorResponse } from "../../utils/sendResponse.js";
import { getByEmail } from "../models/login.model.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const data = matchedData(req);
  console.log("🚀 ~ login ~ data:", data);

  try {
    const [[[user]]] = await getByEmail(data.correo_usuario);
    console.log("🚀 ~ login ~ user:", user);

    if (!user) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (user.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 106, "User not found", req, data);
      }
      case -3: {
        return sendErrorResponse(res, 404, 301, "Error in database", req, data);
      }
    }

    if (user.estado_id == 2) return sendErrorResponse(res, 401, 101, "User Inactivo", req, data);

    // if (user) {
    const password = data.password_usuario.trim();
    const passwordHash = user.password_usuario.trim();

    console.log("password",password)
    console.log("passwordHash",passwordHash)
    const checkPassword = bcrypt.compareSync(password, passwordHash);
    console.log("🚀 ~ login ~ checkPassword:", checkPassword);

    if (!checkPassword) {
      return sendErrorResponse(res, 401, 106, "Datos incorrectos", req, data);
    }
    // }

    return res.status(200).send(JSON.stringify(createToken(user), null, 3));
  } catch (err) {
    console.log("🚀 ~ login ~ err:", err);
    console.log("🚀 ~ login ~ data:", data);
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
