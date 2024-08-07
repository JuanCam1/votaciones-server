import { sendErrorResponse } from "../utils/sendResponse.js";

export const hasType = (types) => {
  return function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    const dataHeader = req.header("x-user-data");
    const payload = JSON.parse(dataHeader);

    if (Object.values(payload).includes("")) {
      return sendErrorResponse(res, 403, 107, "Error in authentification ", req, null);
    }

    if (!types.includes(payload.nombre_role)) {
      return sendErrorResponse(
        res,
        401,
        105,
        "User is not authorized to perform this action",
        req,
        null
      );
    }
    next();
  };
};
