import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { getEstdoAllByStateModel } from "../models/estado.model.js";

export const getEstadoAllStateController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const [[estados]] = await getEstdoAllByStateModel();

    if (!estados) return sendErrorResponse(res, 500, 301, "Error in database", req, null);

    switch (estados.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, null);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay estados", req, null);
    }

    return sendSuccesResponse(res, 200, estados, "api", req, null);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, null);
  }
};
