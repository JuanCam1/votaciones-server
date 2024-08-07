import { db } from "../../../db/db.js";

export const votantesEleccionVotanteCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_votantesEleccionVotanteCountAll(?)", values);
};

export const usuariosEleccionVotanteCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_usuariosEleccionVotanteCountAll(?)", values);
};

export const votoEleccionVotanteCandidatoCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_votoEleccionVotanteCandidatoCountAll(?)", values);
};

export const votoEleccionUsuarioCandidatoCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_votoEleccionUsuarioCandidatoCountAll(?)", values);
};

export const votosCandidatosCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_votosCandidatosCountAll(?)", values);
};

export const votosUsuariosCountAllModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_votosUsuariosCountAll(?)", values);
};

export const getVotaronAllModel = async (limit, offset, orderby, order, eleccion_id) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  eleccion_id = eleccion_id ?? "";

  const values = [limit, offset, orderby, order, eleccion_id];

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_EleccionCandidatoVotante_getAll(?,?,?,?,?)",
    values
  );
  return result;
};

export const countVotaronModel = async (eleccion_id) => {
  eleccion_id = eleccion_id ?? "";
  const values = [eleccion_id];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionCandidatoVotante_countAll(?)", values);
};

export const getNoVotaronAllModel = async (limit, offset, orderby, order, eleccion_id) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "";
  order = order ?? "";
  eleccion_id = eleccion_id ?? "";

  const values = [limit, offset, orderby, order, eleccion_id];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_NoVotaron_getAll(?,?,?,?,?)", values);
  return result;
};

export const countNoVotaronVotanteModel = async (eleccion_id) => {
  eleccion_id = eleccion_id ?? "";
  const values = [eleccion_id];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_NoVotaron_countAll(?)", values);
};

export const getVotaronByEleccionIdModel = async (id_eleccion) => {
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votaron_All(?)", values);
  return result;
};

export const getVotaronUserByEleccionIdModel = async (id_eleccion) => {
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_VotaronUser_All(?)", values);
  return result;
};

export const getNoVotaronByEleccionIdModel = async (id_eleccion) => {
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_NoVotaron_All(?)", values);
  return result;
};

export const getNoVotaronUserByEleccionIdModel = async (id_eleccion) => {
  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_NoVotaronUser_All(?)", values);
  return result;
};


export const getEleccioneJuradoModel = async (id_jurado) => {
  const values = [id_jurado];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_EleccionJurado(?)", values);
  return result;
}