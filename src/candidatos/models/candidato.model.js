import { db } from "../../../db/db.js";

export const getCandidatoIsExistModel = async (cedula_candidato) => {
  cedula_candidato = cedula_candidato ?? "";
  const values = [cedula_candidato];

  const promisePool = db.get().promise();

  return await promisePool.query("CALL strp_Candidato_isExistDocument(?)", values);
};

export const createCandidatoModel = async (
  nombre_candidato,
  cedula_candidato,
  foto_candidato,
  estado_id
) => {
  nombre_candidato = nombre_candidato ?? "";
  cedula_candidato = cedula_candidato ?? "";
  foto_candidato = foto_candidato ?? "";
  estado_id = estado_id ?? "";

  const values = [nombre_candidato, cedula_candidato, foto_candidato, estado_id];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Candidato_create(?,?,?,?)", values);
};

export const updateCandidatoModel = async (
  id_candidato,
  nombre_candidato,
  cedula_candidato,
  foto_candidato,
) => {
  id_candidato = id_candidato ?? "";
  nombre_candidato = nombre_candidato ?? "";
  cedula_candidato = cedula_candidato ?? "";
  foto_candidato = foto_candidato ?? "";

  const values = [id_candidato, nombre_candidato, cedula_candidato, foto_candidato];

  const promisePool = db.get().promise();
  return  await promisePool.query("CALL strp_Candidato_update(?,?,?,?)", values);
};

export const getCandidatoByIdModel = async (id_candidato) => {
  id_candidato = id_candidato ?? "";

  const values = [id_candidato];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Candidato_getById(?)", values);
};

export const getCandidatoAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_candidato";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Candidato_getAll(?,?,?,?,?)", values);
};

export const countCandidatoAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Candidato_countAll(?)", values);
};

export const getCandidatoAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Candidato_AllForState(?)", values);
};

export const changeStateCandidatoModel = async (id_candidato) => {
  id_candidato = id_candidato ?? "";

  const values = [id_candidato];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Candidato_changeState(?)", values);
};

