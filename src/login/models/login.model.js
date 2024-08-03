import { db } from "../../../db/db.js";

export const getByEmail = async (correo_usuario) => {
  correo_usuario = correo_usuario ?? "";
  const values = [correo_usuario];
  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Login_getByEmail(?)", values);
  return result;
}