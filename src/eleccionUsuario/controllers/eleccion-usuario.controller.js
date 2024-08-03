import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import {
  changeStateEleccionUsuarioModel,
  countEleccionUsuarioAllModel,
  createEleccionUsuarioModel,
  getEleccionUsuarioAllByStateModel,
  getEleccionUsuarioAllModel,
  getEleccionUsuarioByIdModel,
  getEleccionUsuarioIsExistModel,
  updateEleccionUsuarioModel,
  usuarioPorIdEleccionStateModel
} from "../models/eleccion-usuario.model.js";

export const createEleccionUsuarioController = async (req, res) => {
  const data = matchedData(req);
  const newUsuarios = [];
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);


    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const { eleccion_id, usuarios_id, estado_id } = data;

    for (const usuario_id of usuarios_id) {
      const [[[EleccionUsuarioId]]] = await getEleccionUsuarioIsExistModel(eleccion_id, usuario_id);
      if (EleccionUsuarioId.result == -2) {
        throw new Error("Error en la base de datos");
      }

      if (EleccionUsuarioId.result == 1) {
        newUsuarios.push(usuario_id);
      }
    }
    
    for (let i = 0; i < newUsuarios.length; i++) {
      const [[[idEleccionUsuario]]] = await createEleccionUsuarioModel(
        eleccion_id,
        newUsuarios[i],
        estado_id
      );

      if (!idEleccionUsuario) {
        throw new Error("Error in database");
      }

      switch (idEleccionUsuario.result) {
        case -1: {
          throw new Error("Error in database");
        }
        case -2: {
          throw new Error("Error in SQL");
        }
        case -3: {
          throw new Error("Error durante ejecución");
        }
      }
    }

    return sendSuccesResponse(res, 202, "creado", "api", req.body, null, data);
  } catch (error) {
    if (error.message) {
      return sendErrorResponse(res, 500, 301, error.message, req.body, data);
    } else {
      return sendErrorResponse(res, 500, 301, "Error in service or database", req.body, data);
    }
  }
};

export const updateEleccionUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const { idEleccionUsuario, eleccion_id, usuario_id } = data;

    const [[[EleccionUsuario]]] = await getEleccionUsuarioByIdModel(idEleccionUsuario);

    if (!EleccionUsuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
    }

    switch (EleccionUsuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "EleccionUsuario no exist", req.body, data);
      }
    }

    const isValid = (value) => value.trim() !== "";

    const eleccionValid = isValid(eleccion_id) ? eleccion_id : EleccionUsuario.eleccion_id;

    const usuarioValid = isValid(usuario_id) ? usuario_id : EleccionUsuario.usuario_id;

    const [[[idEleccionCanBD]]] = await updateEleccionUsuarioModel(
      idEleccionUsuario,
      eleccionValid,
      usuarioValid
    );

    if (!idEleccionCanBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req.body, data);
    }

    switch (idEleccionCanBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req.body, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "EleccionUsuario no exist", req.body, data);
      }
    }

    return sendSuccesResponse(res, 202, "EleccionUsuario update", "api", req.body, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req.body, data);
  }
};

export const getEleccionUsuarioAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[eleccionesUsuarios]] = await getEleccionUsuarioAllByStateModel(data.state);

    if (!eleccionesUsuarios)
      return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);

    switch (eleccionesUsuarios.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay eleccionesUsuarios", req.body, data);
    }

    return sendSuccesResponse(res, 200, eleccionesUsuarios, "api", req.body, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req.body, data);
  }
};

export const getEleccionUsuarioAllController = async (req, res) => {
  const data = matchedData(req);
  try {
    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[eleccionesCandCount]]] = await countEleccionUsuarioAllModel(filter);

    if (!eleccionesCandCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCandCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCandCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[eleccionesCandidatos]] = await getEleccionUsuarioAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!eleccionesCandidatos) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCandidatos.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (eleccionesCandidatos[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: eleccionesCandCount.count,
        eleccionesCandidatos: eleccionesCandidatos
      },
      "api",
      req,
      null,
      data
    );
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getEleccionUsuarioByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[EleccionUsuario]]] = await getEleccionUsuarioByIdModel(data.idEleccionUsuario);

    if (!EleccionUsuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (EleccionUsuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "EleccionUsuario no exist", req, data);
      }
    }
    return sendSuccesResponse(
      res,
      200,
      {
        EleccionUsuario
      },
      "api",
      req,
      null,
      data
    );
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const changeStateEleccionUsuarioController = async (req, res) => {
  const data = matchedData(req);

  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const [[[EleccionUsuario]]] = await getEleccionUsuarioByIdModel(data.idEleccionUsuario);
    if (!EleccionUsuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (EleccionUsuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "EleccionUsuario no exist", req, data);
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionUsuarioModel(data.idEleccionUsuario);

    if (!updateStateEleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateEleccion.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(res, 200, "update state", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const usuariosPorEleccionUsuarioController = async (req, res) => {
  try {
    const data = matchedData(req);
    const { id_eleccion, state } = data;

    const [[candidatos]] = await usuarioPorIdEleccionStateModel(id_eleccion, state);

    if (!candidatos) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (candidatos.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay candidatos", req, data);
    }

    return sendSuccesResponse(res, 200, candidatos, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};
