import { db } from "../../../db/db.js";

export const getEleccionVotanteIsExistModel = async (eleccion_id, votante_id) => {
  eleccion_id = eleccion_id ?? "";
  votante_id = votante_id ?? "";
  const values = [eleccion_id, votante_id];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_EleccionVotante_isExist(?,?)", values);
  return result;
};

export const createEleccionVotanteModel = async (eleccion_id, votante_id, estado_id) => {
  eleccion_id = eleccion_id ?? "";
  votante_id = votante_id ?? "";
  estado_id = estado_id ?? "";

  const values = [eleccion_id, votante_id, estado_id];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_EleccionVotante_create(?,?,?)", values);
  return result;
};

export const updateEleccionVotanteModel = async (id_eleccione_votante, eleccion_id, votante_id) => {
  id_eleccione_votante = id_eleccione_votante ?? "";
  eleccion_id = eleccion_id ?? "";
  votante_id = votante_id ?? "";

  const values = [id_eleccione_votante, eleccion_id, votante_id];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_EleccionVotante_update(?,?,?)", values);
  return result;
};

export const getEleccionVotanteByIdModel = async (id_eleccione_votante) => {
  id_eleccione_votante = id_eleccione_votante ?? "";

  const values = [id_eleccione_votante];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_EleccionVotante_getById(?)", values);
  return result;
};

export const getEleccionVotanteAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_eleccione_votante";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_EleccionVotante_getAll(?,?,?,?,?)", values);
  return result;
};

export const countEleccionVotanteAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionVotante_countAll(?)", values);
};

export const getEleccionVotanteAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
    return await promisePool.query("CALL strp_EleccionVotante_AllForState(?)", values);
};

export const changeStateEleccionVotanteModel = async (id_eleccione_votante) => {
  id_eleccione_votante = id_eleccione_votante ?? "";

  const values = [id_eleccione_votante];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionVotante_changeState(?)", values);
};

export const votantesPorEleccionVotanteModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionVotante_AllVotantes(?)", values);
};

export const eleccionesPorEleccionVotanteModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionVotante_ByIdEleccion(?)", values);
};

export const changeEleccionesPorEleccionVotanteModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionVotante_ByIdEleccionChange(?)", values);
};

export const changeEleccionesPorEleccionUsuarioModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_ByIdEleccionChange(?)", values);
};

export const getEleccionVotanteByIdEleccionAllModel = async (
  limit,
  offset,
  orderby,
  order,
  id_eleccion
) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  id_eleccion = id_eleccion ?? "";

  const values = [limit, offset, orderby, order, id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_VotanteByEleccion_getAll(?,?,?,?,?)", values);
};

export const countEleccionVotanteByIdEleccionAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];
  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionVotanteByEleccion_countAll(?)", values);
};
