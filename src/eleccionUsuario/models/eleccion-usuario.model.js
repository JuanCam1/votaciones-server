import { db } from "../../../db/db.js";

export const getEleccionUsuarioIsExistModel = async (eleccion_id, usuario_id) => {
  eleccion_id = eleccion_id ?? "";
  usuario_id = usuario_id ?? "";
  const values = [eleccion_id, usuario_id];

  const promisePool = db.get().promise();

  return await promisePool.query("CALL strp_EleccionUsuario_isExist(?,?)", values);
};

export const createEleccionUsuarioModel = async (eleccion_id, usuario_id, estado_id) => {
  eleccion_id = eleccion_id ?? "";
  usuario_id = usuario_id ?? "";
  estado_id = estado_id ?? "";

  const values = [eleccion_id, usuario_id, estado_id];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_create(?,?,?)", values);
};

export const updateEleccionUsuarioModel = async (
  id_eleccion_usuario,
  eleccion_id,
  usuario_id
) => {
  id_eleccion_usuario = id_eleccion_usuario ?? "";
  eleccion_id = eleccion_id ?? "";
  usuario_id = usuario_id ?? "";

  const values = [id_eleccion_usuario, eleccion_id, usuario_id];

  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionUsuario_update(?,?,?)", values);
};

export const getEleccionUsuarioByIdModel = async (id_eleccion_usuario) => {
  id_eleccion_usuario = id_eleccion_usuario ?? "";

  const values = [id_eleccion_usuario];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_getById(?)", values);
};

export const getEleccionUsuarioAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_eleccion_usuario";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_getAll(?,?,?,?,?)", values);
};

export const countEleccionUsuarioAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_EleccionUsuario_countAll(?)", values);
};

export const getEleccionUsuarioAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_AllForState(?)", values);
};

export const changeStateEleccionUsuarioModel = async (id_eleccion_usuario) => {
  id_eleccion_usuario = id_eleccion_usuario ?? "";

  const values = [id_eleccion_usuario];

  const promisePool = db.get().promise();
  return await promisePool.query("CALL strp_EleccionUsuario_changeState(?)", values);
};

export const usuarioPorIdEleccionStateModel = async (id_eleccion, state) => {
  id_eleccion = id_eleccion ?? "";
  state = state ?? "Todos";

  const values = [id_eleccion, state];

  const promisePool = db.get().promise();
  return await promisePool.query(
    "CALL strp_EleccionUsuario_UsuariosEstateEleccionId(?,?)",
    values
  );
};
