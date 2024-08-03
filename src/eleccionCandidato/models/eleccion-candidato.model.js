import { db } from "../../../db/db.js";

export const getEleccionCandidatoIsExistModel = async (eleccion_id, candidato_id) => {
  eleccion_id = eleccion_id ?? "";
  candidato_id = candidato_id ?? "";
  const values = [eleccion_id, candidato_id];

  const promisePool = db.get().promise();

  return await promisePool.query("CALL strp_EleccionCandidato_isExist(?,?)", values);
};

export const createEleccionCandidatoModel = async (eleccion_id, candidato_id, estado_id) => {
  eleccion_id = eleccion_id ?? "";
  candidato_id = candidato_id ?? "";
  estado_id = estado_id ?? "";

  const values = [eleccion_id, candidato_id, estado_id];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionCandidato_create(?,?,?)", values);
};

export const updateEleccionCandidatoModel = async (
  id_eleccion_candidato,
  eleccion_id,
  candidato_id
) => {
  id_eleccion_candidato = id_eleccion_candidato ?? "";
  eleccion_id = eleccion_id ?? "";
  candidato_id = candidato_id ?? "";

  const values = [id_eleccion_candidato, eleccion_id, candidato_id];

  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionCandidato_update(?,?,?)", values);
};

export const getEleccionCandidatoByIdModel = async (id_eleccion_candidato) => {
  id_eleccion_candidato = id_eleccion_candidato ?? "";

  const values = [id_eleccion_candidato];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionCandidato_getById(?)", values);
};

export const getEleccionCandidatoAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_eleccion_candidato";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionCandidato_getAll(?,?,?,?,?)", values);
};

export const countEleccionCandidatoAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionCandidato_countAll(?)", values);
};

export const getEleccionCandidatoAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionCandidato_AllForState(?)", values);
};

export const changeStateEleccionCandidatoModel = async (id_eleccion_candidato) => {
  id_eleccion_candidato = id_eleccion_candidato ?? "";

  const values = [id_eleccion_candidato];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionCandidato_changeState(?)", values);
};

export const candidatosPorIdEleccionStateModel = async (id_eleccion, state) => {
  id_eleccion = id_eleccion ?? "";
  state = state ?? "Todos";

  const values = [id_eleccion, state];

  const promisePool = db.get().promise();
  return await promisePool.query(
    "CALL strp_EleccionCandidato_CandidatosEstateEleccionId(?,?)",
    values
  );
};
