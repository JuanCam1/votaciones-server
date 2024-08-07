import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import {
  createVotoUsuarioModel,
  createVotoVotanteModel,
  eleccionByIdUsuarioModel,
  eleccionByIdVotanteModel,
  getUsuarioByCedulaCorreoModel,
  getVotanteByCedulaFechaModel,
  updateUsuarioToken,
  updateVotanteToken,
  validateTokenUsuarioModel,
  validateTokenVotanteModel
} from "../models/votacion.model.js";
import nodeMailer from "nodemailer";
import { config } from "../../../config.js";
import { changeStateEleccionVotanteModel } from "../../eleccionVotante/models/eleccion-votante.model.js";
import { changeStateEleccionUsuarioModel } from "../../eleccionUsuario/models/eleccion-usuario.model.js";
const minutes = 10;
const milliseconds = minutes * 60 * 1000;

export const createVotoUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const {
      id_eleccion_usuario,
      candidato_id,
      eleccion_id,
      usuario_id,
      fecha_voto,
      hora_voto,
      voto_blanco
    } = data;

    const direccion_ip = req.ip;

    const candidatoValid = candidato_id === "" ? null : candidato_id;

    const [[[idVoto]]] = await createVotoUsuarioModel(
      candidatoValid,
      eleccion_id,
      usuario_id,
      direccion_ip,
      fecha_voto,
      hora_voto,
      voto_blanco
    );

    if (!idVoto) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idVoto.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      }
      case -3: {
        return sendErrorResponse(res, 500, 301, "Error durante ejecución", req, data);
      }
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionUsuarioModel(id_eleccion_usuario);

    if (!updateStateEleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateEleccion.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[[valueId]]] = await updateUsuarioToken(usuario_id, null);

    if (!valueId) {
      throw new Error("Error in database");
    }

    switch (valueId.result) {
      case -1: {
        throw new Error("Error in database");
      }
      case -10: {
        throw new Error("no exist");
      }
    }

    return sendSuccesResponse(res, 202, idVoto, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const createVotoVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const {
      id_eleccione_votante,
      candidato_id,
      eleccion_id,
      votante_id,
      fecha_voto,
      hora_voto,
      voto_blanco
    } = data;

    const direccion_ip = req.ip;

    const candidatoValid = candidato_id === "" ? null : candidato_id;

    const [[[idVoto]]] = await createVotoVotanteModel(
      candidatoValid,
      eleccion_id,
      votante_id,
      direccion_ip,
      fecha_voto,
      hora_voto,
      voto_blanco
    );

    if (!idVoto) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idVoto.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      }
      case -3: {
        return sendErrorResponse(res, 500, 301, "Error durante ejecución", req, data);
      }
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionVotanteModel(id_eleccione_votante);

    if (!updateStateEleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateEleccion.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[[valueId]]] = await updateVotanteToken(votante_id, null);

    if (!valueId) {
      throw new Error("Error in database");
    }

    switch (valueId.result) {
      case -1: {
        throw new Error("Error in database");
      }
      case -10: {
        throw new Error("no exist");
      }
    }

    return sendSuccesResponse(res, 202, idVoto, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const eleccionByIdVotanteController = async (req, res) => {
  try {
    const data = matchedData(req);
    const [[elecciones]] = await eleccionByIdVotanteModel(data.id_votante);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Parametro no valido", req, data);
    }

    return sendSuccesResponse(res, 202, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};

export const eleccionByIdUsuarioController = async (req, res) => {
  try {
    const data = matchedData(req);
    const [[elecciones]] = await eleccionByIdUsuarioModel(data.id_usuario);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Parametro no valido", req, data);
    }

    return sendSuccesResponse(res, 202, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};

export const validateTokenUsuarioController = async (req, res) => {
  try {
    const data = matchedData(req);
    const [[[valid]]] = await validateTokenUsuarioModel(data.id_usuario, data.token);

    if (valid.result == -1) {
      return sendErrorResponse(res, 404, 402, "Token no valido", req, data);
    }

    if (valid.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[elecciones]] = await eleccionByIdUsuarioModel(data.id_usuario);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Parametro no valido", req, data);
    }

    return sendSuccesResponse(res, 202, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};

export const validateTokenVotanteController = async (req, res) => {
  try {
    const data = matchedData(req);
    const [[[valid]]] = await validateTokenVotanteModel(data.id_votante, data.token);

    if (valid.result == -1) {
      return sendErrorResponse(res, 404, 402, "Token no valido", req, data);
    }

    if (valid.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[elecciones]] = await eleccionByIdVotanteModel(data.id_votante);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Parametro no valido", req, data);
    }

    return sendSuccesResponse(res, 202, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};

export const getVotanteByCedulaFechaController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[votante]]] = await getVotanteByCedulaFechaModel(
      data.fecha_expedicion_votante,
      data.cedula_votante
    );

    if (!votante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (votante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Votante no exist", req, data);
      }
    }
    const token = generateRandomNumbers();
    sendEmail(res, req, votante, token);

    // setTimeout(() => {
    //   const deleteToken = async () => {
    //     const [[[valueId]]] = await updateVotanteToken(votante.id_votante, null);

    //     if (!valueId) {
    //       throw new Error("Error in database");
    //     }

    //     switch (valueId.result) {
    //       case -1: {
    //         throw new Error("Error in database");
    //       }
    //       case -10: {
    //         throw new Error("no exist");
    //       }
    //     }
    //   };

    //   deleteToken();
    // }, milliseconds);

    return sendSuccesResponse(res, 200, votante, "api", req, null, data);
  } catch (error) {
    if (error.message === "no exist") {
      return sendErrorResponse(res, 500, 301, "Eleccion no exist", req, null);
    }
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getUsuarioByCedulaCorreoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[usuario]]] = await getUsuarioByCedulaCorreoModel(
      data.cedula_usuario,
      data.correo_usuario
    );

    if (!usuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (usuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Usuario no exist", req, data);
      }
    }

    const token = generateRandomNumbers();
    sendEmailUsuario(res, req, usuario, token);

    // setTimeout(() => {
    //   const deleteToken = async () => {
    //     const [[[valueId]]] = await updateUsuarioToken(usuario.id_usuario, null);

    //     if (!valueId) {
    //       throw new Error("Error in database");
    //     }

    //     switch (valueId.result) {
    //       case -1: {
    //         throw new Error("Error in database");
    //       }
    //       case -10: {
    //         throw new Error("no exist");
    //       }
    //     }
    //   };

    //   deleteToken();
    // }, milliseconds);

    return sendSuccesResponse(res, 200, usuario, "api", req, null, data);
  } catch (error) {
    if (error.message === "no exist") {
      return sendErrorResponse(res, 500, 301, "Eleccion no exist", req, null);
    }
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

const sendEmail = async (res, req, votante, token) => {
  let htmlCorreo = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de verificación</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif;">
            <hr>
            <h2>Código de verificación</h2>
            <p>Hola ${votante.nombre_completo},</p>
            <p>Tu código de verificación para iniciar a votar:</p>
            <p>${token}</p>
        </div>
    </body>
    </html>`;

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASSWORD_APPLICATION
    }
  });

  const mailOptions = {
    from: config.EMAIL,
    to: votante.correo_corporativo_votante,
    subject: "Codigo de Verificación",
    html: htmlCorreo
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return sendErrorResponse(res, 500, 301, "Error in send email", req, null);
    } else {
      const [[[valueId]]] = await updateVotanteToken(votante.id_votante, token);

      if (!valueId) {
        throw new Error("Error in database");
      }

      switch (valueId.result) {
        case -1: {
          throw new Error("Error in database");
        }
        case -10: {
          throw new Error("no exist");
        }
      }
    }
  });
};

const sendEmailUsuario = async (res, req, usuario, token) => {
  let htmlCorreo = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de verificación</title>
    </head>
    <body>
        <div style="font-family: Arial, sans-serif;">
            <hr>
            <h2>Código de verificación</h2>
            <p>Hola ${usuario.nombre_completo},</p>
            <p>Tu código de verificación para iniciar a votar:</p>
            <p>${token}</p>
        </div>
    </body>
    </html>`;

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL,
      pass: config.PASSWORD_APPLICATION
    }
  });

  const mailOptions = {
    from: config.EMAIL,
    to: usuario.correo_usuario,
    subject: "Codigo de Verificación",
    html: htmlCorreo
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return sendErrorResponse(res, 500, 301, "Error in send email", req, null);
    } else {
      const [[[valueId]]] = await updateUsuarioToken(usuario.id_usuario, token);

      if (!valueId) {
        throw new Error("Error in database");
      }

      switch (valueId.result) {
        case -1: {
          throw new Error("Error in database");
        }
        case -10: {
          throw new Error("no exist");
        }
      }
    }
  });
};

const generateRandomNumbers = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
