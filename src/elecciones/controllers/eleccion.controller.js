import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import { autoAdjustColumnWidth } from "../../utils/ajustColumn.js";
import {
  changeStateEleccionModel,
  countEleccionAllModel,
  createEleccionModel,
  getEleccionAllByStateModel,
  getEleccionAllModel,
  getEleccionByIdModel,
  getEleccionIsExistModel,
  updateEleccionModel
} from "../models/eleccion.model.js";
import XlsxPopulate from "xlsx-populate";
import {
  changeEleccionesPorEleccionUsuarioModel,
  changeEleccionesPorEleccionVotanteModel
} from "../../eleccionVotante/models/eleccion-votante.model.js";

export const createEleccionController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }
    const {
      nombre_eleccion,
      descripcion_eleccion,
      fecha_ini_eleccion,
      fecha_fin_eleccion,
      hora_ini_eleccion,
      hora_fin_eleccion,
      estado_id
    } = data;

    const nombreCap = formatterCapitalize(nombre_eleccion.trim());

    const [[[eleccionId]]] = await getEleccionIsExistModel(nombreCap);

    if (eleccionId.result == -1) {
      return sendErrorResponse(res, 404, 402, "Eleccion exists", req, data);
    }

    if (eleccionId.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[[idEleccion]]] = await createEleccionModel(
      nombreCap,
      descripcion_eleccion,
      fecha_ini_eleccion,
      fecha_fin_eleccion,
      hora_ini_eleccion,
      hora_fin_eleccion,
      estado_id
    );

    if (!idEleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idEleccion.result) {
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
    return sendSuccesResponse(res, 202, idEleccion, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateEleccionController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const [[[eleccion]]] = await getEleccionByIdModel(data.idEleccion);

    if (!eleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccion.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Eleccion no exist", req, data);
      }
    }

    const {
      idEleccion,
      nombre_eleccion,
      descripcion_eleccion,
      fecha_ini_eleccion,
      fecha_fin_eleccion,
      hora_ini_eleccion,
      hora_fin_eleccion
    } = data;
    const isValid = (value) => value.trim() !== "";

    const nombreCap = isValid(nombre_eleccion)
      ? formatterCapitalize(nombre_eleccion.trim())
      : eleccion.nombre_eleccion;

    const descripCap = isValid(descripcion_eleccion)
      ? formatterCapitalize(descripcion_eleccion)
      : eleccion.descripcion_eleccion;

    const [[[idEleccionBD]]] = await updateEleccionModel(
      idEleccion,
      nombreCap,
      descripCap,
      fecha_ini_eleccion,
      fecha_fin_eleccion,
      hora_ini_eleccion,
      hora_fin_eleccion
    );

    if (!idEleccionBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req, data);
    }

    switch (idEleccionBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "Eleccion no exist", req, data);
      }
    }

    return sendSuccesResponse(res, 202, "Eleccion update", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req, data);
  }
};

export const getEleccionAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[elecciones]] = await getEleccionAllByStateModel(data.stateEleccion);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay elecciones", req, data);
    }

    return sendSuccesResponse(res, 200, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getEleccionAllController = async (req, res) => {
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

    const [[[eleccionesCount]]] = await countEleccionAllModel(filter);

    if (!eleccionesCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[elecciones]] = await getEleccionAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!elecciones) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (elecciones.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (elecciones[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: eleccionesCount.count,
        elecciones: elecciones
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

export const getEleccionByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[eleccion]]] = await getEleccionByIdModel(data.idEleccion);

    if (!eleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccion.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Eleccion no exist", req, data);
      }
    }
    return sendSuccesResponse(
      res,
      200,
      {
        eleccion
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

export const changeStateEleccionController = async (req, res) => {
  const data = matchedData(req);

  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const [[[eleccion]]] = await getEleccionByIdModel(data.idEleccion);

    if (!eleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }


    switch (eleccion.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "Eleccion no exist", req, data);
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionModel(data.idEleccion);

    if (!updateStateEleccion) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateEleccion.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccion.nombre_estado === "Activo") {
      await changeEleccionesPorEleccionVotanteModel(eleccion.id_eleccion);
      await changeEleccionesPorEleccionUsuarioModel(eleccion.id_eleccion);
    }

    return sendSuccesResponse(res, 200, "update state", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getDownloadExcelEleccionController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[elecciones]] = await getEleccionAllByStateModel(data.stateEleccion);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Elecciones no exist", req, data);
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = [
      "ID",
      "Nombre",
      "Descripción",
      "Fecha Inicio",
      "Fecha Final",
      "Hora Inicio",
      "Hora Final",
      "Estado"
    ];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    elecciones.forEach((eleccion, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(eleccion.id_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(eleccion.nombre_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(eleccion.descripcion_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(eleccion.fecha_ini_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(eleccion.fecha_fin_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(eleccion.hora_ini_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 7)
        .value(eleccion.hora_fin_eleccion)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 8)
        .value(eleccion.nombre_estado)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Elecciones.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
