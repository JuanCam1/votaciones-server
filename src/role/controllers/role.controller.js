import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { getRoleAllByStateModel } from "../models/role.model.js";

export const getRoleAllStateController = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const [[roles]] = await getRoleAllByStateModel();

    if (!roles) return sendErrorResponse(res, 500, 301, "Error in database", req);

    switch (roles.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay roles", req);
    }

    return sendSuccesResponse(res, 200, roles, "api", req, null);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req);
  }
};
