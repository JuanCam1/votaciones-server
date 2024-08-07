import { logger } from "../services/apiLogger.js";
import { loggerAdmin } from "../services/adminLogger.js";

export const sendErrorResponse = (res, status, code, message, req = null, data = null) => {
  logger.error(
    `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
      req.params
    )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(
      data
    )}", "error":${message}}`
  );
  return res
    .status(status)
    .send(JSON.stringify({ success: false, error: { code, message } }, null, 3));
};

export const sendSuccesResponse = (res, status, data, type, req = null, payload = null, dataReq=null) => {
  if (type === "admin") {
    loggerAdmin.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(dataReq)}","user":"${
        payload?.namePayload ?? ""
      }"}`
    );
  }

  if (type === "api") {
    logger.info(
      `{"verb":"${req.method}", "path":"${req.baseUrl + req.path}", "params":"${JSON.stringify(
        req.params
      )}", "query":"${JSON.stringify(req.query)}", "body":"${JSON.stringify(dataReq)}"}`
    );
  }
  return res.status(status).send(JSON.stringify({ success: true, data }, null, 3));
};
