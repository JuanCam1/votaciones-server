import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { autoAdjustColumnWidth } from "../../utils/ajustColumn.js";
import {
  countNoVotaronVotanteModel,
  countVotaronModel,
  getNoVotaronAllModel,
  getNoVotaronByEleccionIdModel,
  getNoVotaronUserByEleccionIdModel,
  getVotaronAllModel,
  getVotaronByEleccionIdModel,
  getVotaronUserByEleccionIdModel,
  usuariosEleccionVotanteCountAllModel,
  votantesEleccionVotanteCountAllModel,
  votoEleccionUsuarioCandidatoCountAllModel,
  votoEleccionVotanteCandidatoCountAllModel,
  votosCandidatosCountAllModel,
  votosUsuariosCountAllModel
} from "../models/reporte.model.js";
import XlsxPopulate from "xlsx-populate";
import { candidatosPorIdEleccionStateModel } from "../../eleccionCandidato/models/eleccion-candidato.model.js";

export const pudieronVotarController = async (req, res) => {
  const data = matchedData(req);
  try {
    const { id_eleccion } = data;

    const [[[votantes]]] = await votantesEleccionVotanteCountAllModel(id_eleccion);
    const [[[usuarios]]] = await usuariosEleccionVotanteCountAllModel(id_eleccion);

    if (!votantes || !usuarios) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantes.result === -1 || usuarios.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const pudieronVotar = Number(votantes.count) + Number(usuarios.count);

    return sendSuccesResponse(res, 200, pudieronVotar, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const votaronCountController = async (req, res) => {
  const data = matchedData(req);
  try {
    const { id_eleccion } = data;

    const [[[votantes]]] = await votoEleccionVotanteCandidatoCountAllModel(id_eleccion);
    const [[[usuarios]]] = await votoEleccionUsuarioCandidatoCountAllModel(id_eleccion);

    if (!votantes || !usuarios) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantes.result === -1 || usuarios.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const votaron = Number(votantes.count) + Number(usuarios.count);

    return sendSuccesResponse(res, 200, votaron, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const candidatosCountController = async (req, res) => {
  const data = matchedData(req);
  try {
    const { id_eleccion } = data;

    const [[candidatosVotantes]] = await votosCandidatosCountAllModel(id_eleccion);
    const [[candidatosUsuarios]] = await votosUsuariosCountAllModel(id_eleccion);
    const [[candidatos]] = await candidatosPorIdEleccionStateModel(id_eleccion, "Todos");

    if (!candidatosVotantes || !candidatosUsuarios) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (candidatosVotantes.result === -1 || candidatosUsuarios.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (!candidatos) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (candidatos.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay candidatos", req, data);
    }

    const combinedResults = [...candidatosVotantes];

    candidatosUsuarios.forEach((userCandidato) => {
      const existingCandidato = combinedResults.find(
        (c) => c.candidato_id === userCandidato.candidato_id
      );

      if (existingCandidato) {
        existingCandidato.votos_obtenidos += userCandidato.votos_obtenidos;
      } else {
        combinedResults.push(userCandidato);
      }
    });

    const idsVotos = combinedResults.map((v) => v.candidato_id);

    candidatos.forEach((candidato) => {
      if (!idsVotos.includes(candidato.candidato_id)) {
        combinedResults.push({
          candidato_id: candidato.candidato_id,
          nombre_candidato: candidato.nombre_candidato,
          votos_obtenidos: 0
        });
      }
    });

    return sendSuccesResponse(res, 200, combinedResults, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getVotaronAllController = async (req, res) => {
  const data = matchedData(req);
  try {
    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[votantesCount]]] = await countVotaronModel(data.id_eleccion);

    if (!votantesCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[votantes]] = await getVotaronAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      data.id_eleccion
    );

    if (!votantes) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantes.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (votantes[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: votantesCount.count,
        votantes: votantes
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

export const getNoVotaronAllController = async (req, res) => {
  const data = matchedData(req);
  try {
    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[votantesCount]]] = await countNoVotaronVotanteModel(data.id_eleccion);

    if (!votantesCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[votantes]] = await getNoVotaronAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      data.id_eleccion
    );

    if (!votantes) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantes.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (votantes[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: votantesCount.count,
        votantes: votantes
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

export const getDownloadExcelVotaronController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[votantes]] = await getVotaronByEleccionIdModel(data.id_eleccion);

    if (!votantes) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (votantes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "votantes no exist", req, data);
    }

    const [[usuarios]] = await getVotaronUserByEleccionIdModel(data.id_eleccion);

    if (!usuarios) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (usuarios.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "usuarios no exist", req, data);
    }

    const combinedArray = [...votantes, ...usuarios];

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = [
      "Nombre",
      "Dirección IP",
      "Correo",
      "Telefono",
      "Fecha del voto",
      "Hora del voto"
    ];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    combinedArray.forEach((eleccion, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(eleccion.nombre_completo)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(eleccion.dir_ip)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(eleccion.correo_corporativo_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(eleccion.telefono_votante ?? "000-000")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(eleccion.fecha_voto)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(eleccion.hora_voto)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Votaron.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getDownloadExcelNoVotaronController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[votantes]] = await getNoVotaronByEleccionIdModel(data.id_eleccion);

    if (!votantes) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (votantes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "votantes no exist", req, data);
    }

    const [[usuarios]] = await getNoVotaronUserByEleccionIdModel(data.id_eleccion);

    if (!usuarios) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (usuarios.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "usuarios no exist", req, data);
    }

    const combinedArray = [...votantes, ...usuarios];

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["Nombre", "Correo", "Telefono"];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    combinedArray.forEach((eleccion, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(eleccion.nombre_completo)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(eleccion.correo_corporativo_votante)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(eleccion.telefono_votante ?? "000-000")
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=NoVotaron.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};
