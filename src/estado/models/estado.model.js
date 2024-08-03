import { db } from "../../../db/db.js";

export const getEstdoAllByStateModel = async () => {
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Estado_AllForState()");
  return result;
};
