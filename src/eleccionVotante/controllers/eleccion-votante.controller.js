import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import { autoAdjustColumnWidth } from "../../utils/ajustColumn.js";
import {
  changeStateEleccionVotanteModel,
  countEleccionVotanteAllModel,
  countEleccionVotanteByIdEleccionAllModel,
  createEleccionVotanteModel,
  eleccionesPorEleccionVotanteModel,
  getEleccionVotanteAllByStateModel,
  getEleccionVotanteAllModel,
  getEleccionVotanteByIdEleccionAllModel,
  getEleccionVotanteByIdModel,
  getEleccionVotanteIsExistModel,
  updateEleccionVotanteModel,
  votantesPorEleccionVotanteModel
} from "../models/eleccion-votante.model.js";
import XlsxPopulate from "xlsx-populate";

export const createEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const { eleccion_id, votante_id, estado_id } = data;

    const [[[eleccionVotanteId]]] = await getEleccionVotanteIsExistModel(eleccion_id, votante_id);

    if (eleccionVotanteId.result == -1) {
      return sendErrorResponse(res, 404, 402, "Eleccion Votante exists", req, data);
    }

    if (eleccionVotanteId.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[[idEleccionVotante]]] = await createEleccionVotanteModel(
      eleccion_id,
      votante_id,
      estado_id
    );

    if (!idEleccionVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idEleccionVotante.result) {
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
    return sendSuccesResponse(res, 202, idEleccionVotante, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }
    const { idEleccioneVotante, eleccion_id, votante_id } = data;

    const [[[eleccionVotante]]] = await getEleccionVotanteByIdModel(idEleccioneVotante);

    if (!eleccionVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccionVotante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "EleccionVotante no exist", req, data);
      }
    }

    const isValid = (value) => value.trim() !== "";

    const eleccionValid = isValid(eleccion_id) ? eleccion_id : eleccionVotante.eleccion_id;

    const votanteValid = isValid(votante_id) ? votante_id : eleccionVotante.votante_id;

    const [[[idEleccionBD]]] = await updateEleccionVotanteModel(
      idEleccioneVotante,
      eleccionValid,
      votanteValid
    );

    if (!idEleccionBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req, data);
    }

    switch (idEleccionBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "EleccionVotante no exist", req, data);
      }
    }

    return sendSuccesResponse(res, 202, "EleccionVotante update", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req, data);
  }
};

export const getEleccionVotanteAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[elecciones]] = await getEleccionVotanteAllByStateModel(data.state);

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

export const getEleccionVotanteAllController = async (req, res) => {
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

    const [[[eleccionesVotCount]]] = await countEleccionVotanteAllModel(filter);

    if (!eleccionesVotCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[eleccionesVotantes]] = await getEleccionVotanteAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!eleccionesVotantes) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotantes.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (eleccionesVotantes[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: eleccionesVotCount.count,
        eleccionesVotantes: eleccionesVotantes
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

export const getEleccionVotanteByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[eleccionVotante]]] = await getEleccionVotanteByIdModel(data.idEleccioneVotante);

    if (!eleccionVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccionVotante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "eleccionVotante no exist", req, data);
      }
    }
    return sendSuccesResponse(
      res,
      200,
      {
        eleccionVotante
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

export const changeStateEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);

  try {
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
      return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
    }

    const [[[eleccionVotante]]] = await getEleccionVotanteByIdModel(data.idEleccioneVotante);
    if (!eleccionVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (eleccionVotante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "eleccionVotante no exist", req, data);
    }

    const [[[updateStateEleccion]]] = await changeStateEleccionVotanteModel(
      data.idEleccioneVotante
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

export const downloadVotantesPorEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[votantes]] = await votantesPorEleccionVotanteModel(data.id_eleccion);

    if (!votantes) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (votantes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay elecciones", req, data);
    }
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = [
      "CEDULA",
      "FECHA DE EXPEDICION",
      "FECHA DE NACIMIENTO",
      "FECHA DE INGRESO",
      "NOMBRE1",
      "NOMBRE2",
      "APELLIDO1",
      "APELLIDO2",
      "CORREO CORPORATIVO",
      "CORREO PERSONAL",
      "TELEFONO",
      "DEPENDENCIA",
      "NIVEL",
      "CARGO",
      "CODIGO",
      "GRADO",
      "COD CATEGORIA",
      "COD ESCALAFON",
      "NOMBRE ESCALAFON",
      "DE CARRERA",
      "COD MUN",
      "CIUDAD"
    ];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    votantes.forEach((votante, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(votante.cedula_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(votante.fecha_expedicion_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(votante.fecha_nacimiento_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(votante.fecha_ingreso_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(votante.primer_nombre_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(votante.segundo_nombre_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 7)
        .value(votante.primer_apellido_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 8)
        .value(votante.segundo_apellido_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 9)
        .value(votante.correo_corporativo_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 10)
        .value(votante.correo_personal_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 11)
        .value(votante.telefono_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 12)
        .value(votante.nombre_dependencia_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 13)
        .value(votante.nombre_nivel_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 14)
        .value(votante.nombre_cargo_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 15)
        .value(votante.codigo_cargo_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 16)
        .value(votante.grado_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 17)
        .value(votante.codigo_categoria_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 18)
        .value(votante.codigo_escalafon_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 19)
        .value(votante.nombre_escalafon_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 20)
        .value(votante.carrera_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });

      sheet
        .cell(rowIndex + 2, 21)
        .value(votante.codigo_municipio_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 22)
        .value(votante.nombre_municipio_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Votantes.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const votantesPorEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[votantes]] = await votantesPorEleccionVotanteModel(data.id_eleccion);

    if (!votantes) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (votantes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay votantes", req, data);
    }

    return sendSuccesResponse(res, 200, votantes, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const eleccionesPorEleccionVotanteController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[elecciones]] = await eleccionesPorEleccionVotanteModel(data.id_eleccion);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Error in params", req, data);
    }

    return sendSuccesResponse(res, 200, votantes, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getEleccionVotanteByIdEleccionAllController = async (req, res) => {
  const data = matchedData(req);
  try {
    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[eleccionesVotCount]]] = await countEleccionVotanteByIdEleccionAllModel(
      data.id_eleccion
    );

    if (!eleccionesVotCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[eleccionesVotantes]] = await getEleccionVotanteByIdEleccionAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      data.id_eleccion
    );

    if (!eleccionesVotantes) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (eleccionesVotantes.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (eleccionesVotantes[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: eleccionesVotCount.count,
        eleccionesVotantes: eleccionesVotantes
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
