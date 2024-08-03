import { db } from "../../../db/db.js";

export const getVotanteByCedulaFechaModel = async (fecha_expedicion_votante, cedula_votante) => {
  fecha_expedicion_votante = fecha_expedicion_votante ?? "";
  cedula_votante = cedula_votante ?? "";

  const values = [fecha_expedicion_votante, cedula_votante];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Votante_isExistDocumentEmail(?,?)", values);
};

export const getUsuarioByCedulaCorreoModel = async (cedula_usuario, correo_usuario) => {
  cedula_usuario = cedula_usuario ?? "";
  correo_usuario = correo_usuario ?? "";

  const values = [cedula_usuario, correo_usuario];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_Usuario_isExistDocumentEmail(?,?)", values);
};

export const updateVotanteToken = (id_votante, token) => {
  id_votante = id_votante ?? "";
  token = token ?? null;

  const values = [id_votante, token];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Votante_updateToken(?,?)", values);
};

export const updateUsuarioToken = (id_usuario, token) => {
  id_usuario = id_usuario ?? "";
  token = token ?? null;

  const values = [id_usuario, token];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Usuario_updateToken(?,?)", values);
};

export const validateTokenUsuarioModel = async (id_usuario, token) => {
  id_usuario = id_usuario ?? "";
  token = token ?? null;

  const values = [id_usuario, token];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_Usuario_validateToken(?,?)", values);
  return result;
};

export const validateTokenVotanteModel = async (id_votante, token) => {
  id_votante = id_votante ?? "";
  token = token ?? null;

  const values = [id_votante, token];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_Votante_validateToken(?,?)", values);
  return result;
};

export const eleccionByIdVotanteModel = async (id_votante) => {
  id_votante = id_votante ?? "";

  const values = [id_votante];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_Eleccion_ByIdVotante(?)", values);
  return result;
};

export const eleccionByIdUsuarioModel = async (id_usuario) => {
  id_usuario = id_usuario ?? "";

  const values = [id_usuario];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_Eleccion_ByIdUsuario(?)", values);
  return result;
};

export const getEleccionCandidatoVotanteIsExistModel = async (
  eleccion_id,
  candidato_id,
  votante_id
) => {
  eleccion_id = eleccion_id ?? "";
  candidato_id = candidato_id ?? "";
  votante_id = votante_id ?? "";
  const values = [eleccion_id, candidato_id, votante_id];

  const promisePool = db.get().promise();

  return await promisePool.query("CALL strp_EleccionCandidatoVotante_isExist(?,?,?)", values);
};

export const getEleccionCandidatoUsuarioIsExistModel = async (
  eleccion_id,
  candidato_id,
  usuario_id
) => {
  eleccion_id = eleccion_id ?? "";
  candidato_id = candidato_id ?? "";
  usuario_id = usuario_id ?? "";
  const values = [eleccion_id, candidato_id, usuario_id];

  const promisePool = db.get().promise();

  return await promisePool.query("CALL strp_EleccionCandidatoUsuario_isExist(?,?,?)", values);
};

export const createVotoVotanteModel = async (
  candidato_id,
  eleccion_id,
  votante_id,
  direccion_ip,
  fecha_voto,
  hora_voto,
  voto_blanco
) => {
  candidato_id = candidato_id ?? null;
  eleccion_id = eleccion_id ?? "";
  votante_id = votante_id ?? "";
  direccion_ip = direccion_ip ?? "";
  fecha_voto = fecha_voto ?? "";
  hora_voto = hora_voto ?? "";
  voto_blanco = voto_blanco ?? "";

  const values = [
    candidato_id,
    eleccion_id,
    votante_id,
    direccion_ip,
    fecha_voto,
    hora_voto,
    voto_blanco
  ];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_VotoVotante_create(?,?,?,?,?,?,?)", values);
};

export const createVotoUsuarioModel = async (
  candidato_id,
  eleccion_id,
  usuario_id,
  direccion_ip,
  fecha_voto,
  hora_voto,
  voto_blanco
) => {
  candidato_id = candidato_id ?? null;
  eleccion_id = eleccion_id ?? "";
  usuario_id = usuario_id ?? "";
  direccion_ip = direccion_ip ?? "";
  fecha_voto = fecha_voto ?? "";
  hora_voto = hora_voto ?? "";
  voto_blanco = voto_blanco ?? "";

  const values = [
    candidato_id,
    eleccion_id,
    usuario_id,
    direccion_ip,
    fecha_voto,
    hora_voto,
    voto_blanco
  ];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_VotoUsuario_create(?,?,?,?,?,?,?)", values);
};
