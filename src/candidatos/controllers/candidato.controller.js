import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import { autoAdjustColumnWidth } from "../../utils/ajustColumn.js";
import {
  getCandidatoIsExistModel,
  createCandidatoModel,
  updateCandidatoModel,
  getCandidatoByIdModel,
  getCandidatoAllModel,
  countCandidatoAllModel,
  getCandidatoAllByStateModel,
  changeStateCandidatoModel
} from "../models/candidato.model.js";
import path from "path";
import fs from "fs";
import XlsxPopulate from "xlsx-populate";

const mimeTypes = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png"
};

export const getImageCandidato = async (req, res) => {
  const { fileName } = matchedData(req);

  const filepath = path.join(process.cwd(), "uploads/photos/candidatos", fileName);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return sendErrorResponse(res, 404, 301, filepath, req, null);
    }

    const ext = path.extname(filepath).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.sendFile(filepath);
  });
};

export const createCandidatoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const { nombre_candidato, cedula_candidato, estado_id } = data;

    const nombreCap = formatterCapitalize(nombre_candidato.trim());

    const [[[candidatoId]]] = await getCandidatoIsExistModel(cedula_candidato);

    if (candidatoId.result == -1) {
      return sendErrorResponse(res, 404, 402, "Candidato exists", req, data);
    }

    if (candidatoId.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const photo = req?.file?.filename ?? "sinphoto.jpg";

    const [[[idCandidato]]] = await createCandidatoModel(
      nombreCap,
      cedula_candidato,
      photo,
      estado_id
    );

    if (!idCandidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idCandidato.result) {
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
    return sendSuccesResponse(res, 202, idCandidato, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateCandidatoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }
    const newPhoto = req?.file?.filename;
    const [[[candidato]]] = await getCandidatoByIdModel(data.idCandidato);

    if (!candidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (candidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Candidato no exist", req, data);
      }
    }

    const { idCandidato, nombre_candidato, cedula_candidato, eleccion_id } = data;
    const isValid = (value) => value.trim() !== "";

    const nombreCap = isValid(nombre_candidato)
      ? formatterCapitalize(nombre_candidato.trim())
      : candidato.nombre_candidato;
    const cedulaValid = isValid(cedula_candidato)
      ? formatterCapitalize(cedula_candidato.trim())
      : candidato.cedula_candidato;

    if (candidato.foto_candidato !== "sinphoto.jpg") {
      if (newPhoto && candidato.foto_candidato) {
        fs.unlink(
          path.join(process.cwd(), "uploads/photos/candidatos", candidato.foto_candidato),
          (err) => {
            if (err) {
              return sendErrorResponse(res, 500, 301, "Error in update user", req, data);
            }
          }
        );
      }
    }

    const photo = newPhoto || candidato.foto_candidato;

    const [[[idCandidatoBD]]] = await updateCandidatoModel(
      idCandidato,
      nombreCap,
      cedulaValid,
      photo
    );

    if (!idCandidatoBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req, data);
    }

    switch (idCandidatoBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "Candidato no exist", req, data);
      }
    }

    return sendSuccesResponse(res, 202, "Candidato update", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req, data);
  }
};

export const getCandidatoAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[candidatos]] = await getCandidatoAllByStateModel(data.state);

    if (!candidatos) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

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

export const getCandidatoAllController = async (req, res) => {
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

    const [[[candidatosCount]]] = await countCandidatoAllModel(filter);

    if (!candidatosCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (candidatosCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (candidatosCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[candidatos]] = await getCandidatoAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!candidatos) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (candidatos.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (candidatos[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: candidatosCount.count,
        candidatos: candidatos
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

export const getCandidatoByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[candidato]]] = await getCandidatoByIdModel(data.idCandidato);

    if (!candidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (candidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Candidato no exist", req, data);
      }
    }
    return sendSuccesResponse(res, 200, candidato, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const changeStateCandidatoController = async (req, res) => {
  const data = matchedData(req);

  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }
    const [[[candidato]]] = await getCandidatoByIdModel(data.idCandidato);
    
    if (!candidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (candidato.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "Candidato no exist", req, data);
    }

    const [[[updateStateCandidato]]] = await changeStateCandidatoModel(data.idCandidato);

    if (!updateStateCandidato) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateCandidato.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(res, 200, "update state", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getDownloadExcelCandidatoController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[candidatos]] = await getCandidatoAllByStateModel(data.state);

    if (!candidatos) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (candidatos.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "candidatos no exist", req, data);
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Nombre", "Cedula", "Estado"];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    candidatos.forEach((candidato, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(candidato.id_candidato)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(candidato.nombre_candidato)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(candidato.cedula_candidato)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(candidato.nombre_estado)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Candidatos.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
