import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import {
  candidatosPorIdEleccionStateModel,
  countEleccionCandidatoAllModel,
  createEleccionCandidatoModel,
  getEleccionCandidatoIsExistModel,
  updateEleccionCandidatoModel,
  getEleccionCandidatoAllByStateModel,
  changeStateEleccionCandidatoModel,
  getEleccionCandidatoByIdModel,
  getEleccionCandidatoAllModel
} from "../models/eleccion-candidato.model.js";

export const createEleccionCandidatoController = async (req, res) => {
  const data = matchedData(req);
  const newCandidatos = [];
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }
    const { eleccion_id, candidatos_id, estado_id } = data;

    for (const candidato_id of candidatos_id) {
      const [[[eleccionCandidatoId]]] = await getEleccionCandidatoIsExistModel(
        eleccion_id,
        candidato_id
      );

      if (eleccionCandidatoId.result == -2) {
        throw new Error("Error en la base de datos");
      }

      if (eleccionCandidatoId.result == 1) {
        newCandidatos.push(candidato_id);
      }
    }

    for (let i = 0; i < newCandidatos.length; i++) {
      const [[[idEleccionCandidato]]] = await createEleccionCandidatoModel(
        eleccion_id,
        newCandidatos[i],
        estado_id
      );

      if (!idEleccionCandidato) {
        throw new Error("Error in database");
      }

      switch (idEleccionCandidato.result) {
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

export const updateEleccionCandidatoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const { idEleccionCandidato, eleccion_id, candidato_id } = data;

    const [[[eleccionCandidato]]] = await getEleccionCandidatoByIdModel(idEleccionCandidato);

    if (!eleccionCandidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
    }

    switch (eleccionCandidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "eleccionCandidato no exist", req.body, data);
      }
    }

    const isValid = (value) => value.trim() !== "";

    const eleccionValid = isValid(eleccion_id) ? eleccion_id : eleccionCandidato.eleccion_id;

    const candidatoValid = isValid(candidato_id) ? candidato_id : eleccionCandidato.candidato_id;

    const [[[idEleccionCanBD]]] = await updateEleccionCandidatoModel(
      idEleccionCandidato,
      eleccionValid,
      candidatoValid
    );

    if (!idEleccionCanBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req.body, data);
    }

    switch (idEleccionCanBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req.body, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "EleccionVotante no exist", req.body, data);
      }
    }

    return sendSuccesResponse(res, 202, "EleccionVotante update", "api", req.body, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req.body, data);
  }
};

export const getEleccionCandidatoAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[eleccionesCandidatos]] = await getEleccionCandidatoAllByStateModel(data.state);

    if (!eleccionesCandidatos)
      return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);

    switch (eleccionesCandidatos.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req.body, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay eleccionesCandidatos", req.body, data);
    }

    return sendSuccesResponse(res, 200, eleccionesCandidatos, "api", req.body, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req.body, data);
  }
};

export const getEleccionCandidatoAllController = async (req, res) => {
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

    const [[[eleccionesCandCount]]] = await countEleccionCandidatoAllModel(filter);

    if (!eleccionesCandCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCandCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCandCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[eleccionesCandidatos]] = await getEleccionCandidatoAllModel(
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

export const getEleccionCandidatoByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[eleccionCandidato]]] = await getEleccionCandidatoByIdModel(data.idEleccionCandidato);

    if (!eleccionCandidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccionCandidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "eleccionCandidato no exist", req, data);
      }
    }
    return sendSuccesResponse(
      res,
      200,
      {
        eleccionCandidato
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

export const changeStateEleccionCandidatoController = async (req, res) => {
  const data = matchedData(req);

  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const [[[eleccionCandidato]]] = await getEleccionCandidatoByIdModel(data.idEleccionCandidato);
    if (!eleccionCandidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccionCandidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "eleccionCandidato no exist", req, data);
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionCandidatoModel(
      data.idEleccionCandidato
    );

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

export const candidatosPorEleccionCandidatoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[candidatos]] = await candidatosPorIdEleccionStateModel(data.id_eleccion, data.state);

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
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
