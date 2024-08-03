import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import {
  changeStateVotanteModel,
  countVotanteAllModel,
  createVotanteModel,
  getVotanteAllByStateModel,
  getVotanteAllModel,
  getVotanteByIdModel,
  getVotanteIsExistModel,
  isExistVotante,
  updateVotanteModel
} from "../models/votante.model.js";

export const createVotanteController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = matchedData(req);
  try {
    const {
      cedula_votante,
      primer_nombre_votante,
      segundo_nombre_votante,
      primer_apellido_votante,
      segundo_apellido_votante,
      correo_corporativo_votante,
      correo_personal_votante,
      nombre_dependencia_votante,
      nombre_nivel_votante,
      nombre_cargo_votante,
      nombre_escalafon_votante,
      nombre_municipio_votante
    } = data;

    const primerNombreCap = formatterCapitalize(primer_nombre_votante);
    const primerApellCap = formatterCapitalize(primer_apellido_votante);
    const nombreDependenciaCap = formatterCapitalize(nombre_dependencia_votante);
    const nombreNivelCap = formatterCapitalize(nombre_nivel_votante);
    const nombreCargoCap = formatterCapitalize(nombre_cargo_votante);
    const nombreEscalafonCap = formatterCapitalize(nombre_escalafon_votante);
    const nombreMunicipioCap = formatterCapitalize(nombre_municipio_votante);

    const segundoNombreCap = segundo_nombre_votante
      ? formatterCapitalize(segundo_nombre_votante)
      : null;

    const segundoApellCap = segundo_apellido_votante
      ? formatterCapitalize(segundo_apellido_votante)
      : null;

    const [[[votanteDocument]]] = await getVotanteIsExistModel(
      cedula_votante,
      isExistVotante.document
    );

    const [[[votanteEmailPersonal]]] = await getVotanteIsExistModel(
      correo_personal_votante,
      isExistVotante.emailPersonal
    );

    const [[[votanteEmailCorpo]]] = await getVotanteIsExistModel(
      correo_corporativo_votante,
      isExistVotante.emailCorporativo
    );

    if (votanteDocument.result == -1)
      return sendErrorResponse(res, 404, 402, "Cedula exists", req, data);
    if (votanteEmailPersonal.result == -1)
      return sendErrorResponse(res, 404, 402, "Email Personal exists", req, data);
    if (votanteEmailCorpo.result == -1)
      return sendErrorResponse(res, 404, 402, "Email Corporativo exists", req, data);

    if (
      votanteDocument.result == -2 ||
      votanteEmail.result == -2 ||
      votanteEmailCorpo.result == -2
    ) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const [[[idVotante]]] = await createVotanteModel(
      cedula_votante,
      data.fecha_expedicion_votante,
      data.fecha_nacimiento_votante,
      data.fecha_ingreso_votante,
      primerNombreCap,
      segundoNombreCap,
      primerApellCap,
      segundoApellCap,
      correo_corporativo_votante,
      correo_personal_votante,
      data.telefono_votante,
      data.carrera_votante,
      nombreDependenciaCap,
      nombreNivelCap,
      data.codigo_cargo_votante,
      nombreCargoCap,
      data.grado_votante,
      data.codigo_categoria_votante,
      data.codigo_escalafon_votante,
      nombreEscalafonCap,
      data.codigo_municipio_votante,
      nombreMunicipioCap,
      data.estado_id,
      data.role_id
    );

    if (!idVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idVotante.result) {
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
    return sendSuccesResponse(res, 202, "Creado votante", "api", req, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateVotanteController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = matchedData(req);
  try {
    const [[[votante]]] = await getVotanteByIdModel(data.idVotante);

    if (!votante) {
      return sendErrorResponse(res, 404, 402, "Error in database", req, data);
    }

    switch (votante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Votante no exist", req, data);
      }
    }

    const {
      idVotante,
      cedula_votante,
      fecha_expedicion_votante,
      fecha_nacimiento_votante,
      fecha_ingreso_votante,
      primer_nombre_votante,
      segundo_nombre_votante,
      primer_apellido_votante,
      segundo_apellido_votante,
      correo_corporativo_votante,
      correo_personal_votante,
      telefono_votante,
      carrera_votante,
      nombre_dependencia_votante,
      nombre_nivel_votante,
      codigo_cargo_votante,
      nombre_cargo_votante,
      grado_votante,
      codigo_categoria_votante,
      codigo_escalafon_votante,
      nombre_escalafon_votante,
      codigo_municipio_votante,
      nombre_municipio_votante
    } = data;

    const isValid = (value) => value.trim() !== "";
    const cedulaValid = isValid(cedula_votante) ? cedula_votante : votante.cedula_votante;
    const fechaExpValid = isValid(fecha_expedicion_votante)
      ? fecha_expedicion_votante
      : votante.fecha_expedicion_votante;
    const fechaNacValid = isValid(fecha_nacimiento_votante)
      ? fecha_nacimiento_votante
      : votante.fecha_nacimiento_votante;
    const fechaIngValid = isValid(fecha_ingreso_votante)
      ? fecha_ingreso_votante
      : votante.fecha_ingreso_votante;
    const correoCorpoValid = isValid(correo_corporativo_votante)
      ? correo_corporativo_votante
      : votante.correo_corporativo_votante;
    const correoPersValid = isValid(correo_personal_votante)
      ? correo_personal_votante
      : votante.correo_personal_votante;

    const telefonoValid = isValid(telefono_votante) ? telefono_votante : votante.telefono_votante;
    const carreraValid = isValid(carrera_votante) ? carrera_votante : votante.carrera_votante;
    const codCargoValid = isValid(codigo_cargo_votante)
      ? codigo_cargo_votante
      : votante.codigo_cargo_votante;
    const gradoValid = isValid(grado_votante) ? grado_votante : votante.grado_votante;
    const codCategValid = isValid(codigo_categoria_votante)
      ? codigo_categoria_votante
      : votante.codigo_categoria_votante;
    const codEscaValid = isValid(codigo_escalafon_votante)
      ? codigo_escalafon_votante
      : votante.codigo_escalafon_votante;
    const codMuniValid = isValid(codigo_municipio_votante)
      ? codigo_municipio_votante
      : votante.codigo_municipio_votante;

    const primerNombreCap = isValid(primer_nombre_votante)
      ? formatterCapitalize(primer_nombre_votante.trim())
      : votante.primer_nombre_votante;

    const primerApellCap = isValid(primer_apellido_votante)
      ? formatterCapitalize(primer_apellido_votante)
      : votante.primer_apellido_votante;

    const nombreDependenciaCap = isValid(nombre_dependencia_votante)
      ? formatterCapitalize(nombre_dependencia_votante)
      : votante.nombre_dependencia_votante;

    const nombreNivelCap = isValid(nombre_nivel_votante)
      ? formatterCapitalize(nombre_nivel_votante)
      : votante.nombre_nivel_votante;

    const nombreCargoCap = isValid(nombre_cargo_votante)
      ? formatterCapitalize(nombre_cargo_votante)
      : votante.nombre_cargo_votante;

    const nombreEscalafonCap = isValid(nombre_escalafon_votante)
      ? formatterCapitalize(nombre_escalafon_votante)
      : votante.nombre_escalafon_votante;

    const nombreMunicipioCap = isValid(nombre_municipio_votante)
      ? formatterCapitalize(nombre_municipio_votante)
      : votante.nombre_municipio_votante;

    const segundoNombreCap = isValid(segundo_nombre_votante)
      ? formatterCapitalize(segundo_nombre_votante)
      : votante.segundo_nombre_votante;

    const segundoApellCap = isValid(segundo_apellido_votante)
      ? formatterCapitalize(segundo_apellido_votante)
      : votante.segundo_apellido_votante;

    const [[[votanteId]]] = await updateVotanteModel(
      idVotante,
      cedulaValid,
      fechaExpValid,
      fechaNacValid,
      fechaIngValid,
      primerNombreCap,
      segundoNombreCap,
      primerApellCap,
      segundoApellCap,
      correoCorpoValid,
      correoPersValid,
      telefonoValid,
      carreraValid,
      nombreDependenciaCap,
      nombreNivelCap,
      codCargoValid,
      nombreCargoCap,
      gradoValid,
      codCategValid,
      codEscaValid,
      nombreEscalafonCap,
      codMuniValid,
      nombreMunicipioCap
    );

    if (!votanteId) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (votanteId.result) {
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
    return sendSuccesResponse(res, 202, "Actualizado votante", "api", req, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getVotanteAllStateController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[elecciones]] = await getVotanteAllByStateModel(data.stateVotante);

    if (!elecciones) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (elecciones.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay votantes", req, data);
    }

    return sendSuccesResponse(res, 200, elecciones, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getVotanteAllController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

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

    const [[[votantesCount]]] = await countVotanteAllModel(filter);

    if (!votantesCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (votantesCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[votantes]] = await getVotanteAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
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

export const getVotanteByIdController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const data = matchedData(req);
  try {
    const [[[votante]]] = await getVotanteByIdModel(data.idVotante);

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
    return sendSuccesResponse(
      res,
      200,
      {
        votante
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

export const changeStateVotanteController = async (req, res) => {
  const data = matchedData(req);

  const [[[votante]]] = await getVotanteByIdModel(data.idVotante);

  try {
    if (!votante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (votante.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "Votante no exist", req, data);
    }

    const [[[updateStateVotante]]] = await changeStateVotanteModel(data.idVotante);

    if (!updateStateVotante) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateVotante.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(res, 200, "update state", "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getDownloadExcelVotanteController = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const data = matchedData(req);

    const [[votantes]] = await getVotanteAllByStateModel(data.stateEleccion);

    if (!votantes) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (votantes.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Votantes no exist", req, data);
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = [
      "CEDULA",
      "FECHA DE EXPEDICION",
      "FECHA NACIMIENTO",
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
