import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import XlsxPopulate from "xlsx-populate";
import csv from "csv-parser";
import { Readable } from "stream";
import {
  createVotanteModel,
  getVotanteValidateModel
} from "../../votantes/models/votante.model.js";
import {
  createEleccionVotanteModel,
  getEleccionVotanteIsExistModel
} from "../../eleccionVotante/models/eleccion-votante.model.js";

export const uploadFileController = async (req, res) => {
  const data = matchedData(req);
  const dataHeader = req.header("x-user-data");
  const payload = JSON.parse(dataHeader);

  if (!payload.id_usuario || payload.nombre_role !== "Administrador") {
    return sendErrorResponse(res, 403, 107, "Error in authentification", req.body, data);
  }
  const { file } = req;
  const newVoters = [];

  if (!file) {
    return sendErrorResponse(res, 404, 301, "File is required", req, data);
  }

  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    try {
      const workbook = await XlsxPopulate.fromDataAsync(req.file.buffer);
      const sheet = workbook.sheet(0);
      const csvData = sheet
        .usedRange()
        .value()
        .map((row) => row.join(","))
        .join("\n");

      const readableStream = Readable.from(csvData);

      readableStream
        .pipe(csv())
        .on("data", async (row) => {
          const rawRow = cleanRowKeys(row);

          if (Object.values(row).every((value) => value.trim() === "")) {
            return;
          }

          if (!validateRow(rawRow)) {
            throw new Error("Invalid data detected. Process stopped.");
          }

          if (rawRow.FECHA_DE_EXPEDICION) {
            rawRow.FECHA_DE_EXPEDICION = excelDateToJSDate(Number(rawRow.FECHA_DE_EXPEDICION));
          }
          if (rawRow.FECHA_DE_NACIMIENTO) {
            rawRow.FECHA_DE_NACIMIENTO = excelDateToJSDate(Number(rawRow.FECHA_DE_NACIMIENTO));
          }
          if (rawRow.FECHA_DE_INGRESO) {
            rawRow.FECHA_DE_INGRESO = excelDateToJSDate(Number(rawRow.FECHA_DE_INGRESO));
          }

          newVoters.push(rawRow);
        })
        .on("end", async () => {
          const insertVotantes = async (votantes) => {
            for (const votante of votantes) {
              try {
                const [[[idExist]]] = await getVotanteValidateModel(
                  votante.CEDULA,
                  votante.CORREO_CORPORATIVO,
                  votante.CORREO_PERSONAL
                );

                let voterId;

                if (idExist.result === 0) {
                  const primerNombreCap = formatterCapitalize(votante.NOMBRE1);
                  const primerApellCap = formatterCapitalize(votante.APELLIDO1);
                  const nombreDependenciaCap = formatterCapitalize(votante.DEPENDENCIA);
                  const nombreNivelCap = formatterCapitalize(votante.NIVEL);
                  const nombreCargoCap = formatterCapitalize(votante.CARGO);
                  const nombreEscalafonCap = formatterCapitalize(votante.NOMBRE_ESCALAFON);
                  const nombreMunicipioCap = formatterCapitalize(votante.CIUDAD);

                  const segundoNombreCap = votante.NOMBRE2
                    ? formatterCapitalize(votante.NOMBRE2)
                    : null;

                  const segundoApellCap = votante.APELLIDO2
                    ? formatterCapitalize(votante.APELLIDO2)
                    : null;

                  const [[[idVotante]]] = await createVotanteModel(
                    votante.CEDULA,
                    votante.FECHA_DE_EXPEDICION,
                    votante.FECHA_DE_NACIMIENTO,
                    votante.FECHA_DE_INGRESO,
                    primerNombreCap,
                    segundoNombreCap,
                    primerApellCap,
                    segundoApellCap,
                    votante.CORREO_CORPORATIVO,
                    votante.CORREO_PERSONAL,
                    votante.TELEFONO,
                    votante.DE_CARRERA,
                    nombreDependenciaCap,
                    nombreNivelCap,
                    votante.CODIGO,
                    nombreCargoCap,
                    votante.GRADO,
                    votante.COD_CATEGORIA,
                    votante.COD_ESCALAFON,
                    nombreEscalafonCap,
                    votante.COD_MUN,
                    nombreMunicipioCap,
                    1,
                    4
                  );

                  voterId = idVotante.id_votante;
                } else {
                  voterId = idExist.result;
                }

                const [[[eleccionVotanteId]]] = await getEleccionVotanteIsExistModel(
                  data.idEleccion,
                  voterId
                );

                if (eleccionVotanteId.result === 1) {
                  const [[[idEleccionVotante]]] = await createEleccionVotanteModel(
                    data.idEleccion,
                    voterId,
                    1
                  );
                }
              } catch (error) {
                return sendErrorResponse(res, 500, 301, error, req, data);
              }
            }
          };

          await insertVotantes(newVoters);
          return sendSuccesResponse(
            res,
            202,
            "File processed and data saved to database",
            "api",
            req,
            null,
            data
          );
        })
        .on("error", async (err) => {
          return sendErrorResponse(res, 500, 301, "Error processing file: " + err, req, data);
        });
    } catch (error) {
      return sendErrorResponse(res, 404, 301, "Error processing", req, data);
    }
  } else {
    return sendErrorResponse(res, 404, 301, "File is not excel", req, data);
  }
};

const validateRow = (row) => {
  const allowedEmptyFields = ["NOMBRE2", "APELLIDO2"];
  for (const [key, value] of Object.entries(row)) {
    if (!allowedEmptyFields.includes(key) && value.trim() === "") {
      return false;
    }
  }
  const regex = /^\d+$/;
  if (row.No && !regex.test(row.No)) return false;
  if (row.TELEFONO && !regex.test(row.TELEFONO)) return false;
  if (row.CEDULA && !regex.test(row.CEDULA)) return false;
  if (row.CODIGO && !regex.test(row.CODIGO)) return false;
  if (row.GRADO && !regex.test(row.GRADO)) return false;
  if (row.COD_CATEGORIA && !regex.test(row.COD_CATEGORIA)) return false;
  if (row.COD_ESCALAFON && !regex.test(row.COD_ESCALAFON)) return false;
  if (row.COD_MUN && !regex.test(row.COD_MUN)) return false;

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (row.CORREO_CORPORATIVO && !regexEmail.test(row.CORREO_CORPORATIVO)) return false;
  if (row.CORREO_PERSONAL && !regexEmail.test(row.CORREO_PERSONAL)) return false;

  return true;
};

const cleanRowKeys = (row) => {
  const cleanedRow = {};
  for (const key in row) {
    const cleanKey = key.replace(/\s+/g, "_");
    cleanedRow[cleanKey] = row[key];
  }
  return cleanedRow;
};

const excelDateToJSDate = (serial) => {
  const excelEpoch = new Date(1900, 0, 1);
  const jsDate = new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
  return jsDate.toISOString().split("T")[0];
};
