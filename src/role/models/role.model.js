import { db } from "../../../db/db.js";

export const getRoleAllByStateModel = async () => {
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Role_AllForState()");
  return result;
};
