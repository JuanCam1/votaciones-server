import { db } from "../../../db/db.js";

export const getUsuarioIsExistModel = async (value, type) => {
  value = value ?? "";
  const values = [value];

  const promisePool = db.get().promise();

  switch (type) {
    case "cedula_usuario": {
      const result = await promisePool.query("CALL strp_Usuario_isExistDocument(?)", values);
      return result;
    }
    case "correo_usuario": {
      const result = await promisePool.query("CALL strp_Usuario_isExistEmail(?)", values);
      return result;
    }
  }
};

export const createUsuarioModel = async (
  cedula_usuario,
  nombre_usuario,
  lastname_usuario,
  correo_usuario,
  password_usuario,
  foto_usuario,
  role_id,
  estado_id
) => {
  cedula_usuario = cedula_usuario ?? "";
  nombre_usuario = nombre_usuario ?? "";
  lastname_usuario = lastname_usuario ?? "";
  correo_usuario = correo_usuario ?? "";
  password_usuario = password_usuario ?? "";
  foto_usuario = foto_usuario ?? "";
  role_id = role_id ?? "";
  estado_id = estado_id ?? "";

  const values = [
    cedula_usuario,
    nombre_usuario,
    lastname_usuario,
    correo_usuario,
    password_usuario,
    foto_usuario,
    role_id,
    estado_id
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_create(?,?,?,?,?,?,?,?)", values);
  return result;
};

export const updateUsuarioModel = async (
  id_usuario,
  cedula_usuario,
  nombre_usuario,
  lastname_usuario,
  correo_usuario,
  password_usuario,
  foto_usuario,
  role_id
) => {
  id_usuario = id_usuario ?? "";
  cedula_usuario = cedula_usuario ?? "";
  nombre_usuario = nombre_usuario ?? "";
  lastname_usuario = lastname_usuario ?? "";
  correo_usuario = correo_usuario ?? "";
  password_usuario = password_usuario ?? "";
  foto_usuario = foto_usuario ?? "";
  role_id = role_id ?? "";

  const values = [
    id_usuario,
    cedula_usuario,
    nombre_usuario,
    lastname_usuario,
    correo_usuario,
    password_usuario,
    foto_usuario,
    role_id
  ];


  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_update(?,?,?,?,?,?,?,?)", values);
  return result;
};

export const getUsuarioByIdModel = async (id_usuario) => {
  id_usuario = id_usuario ?? "";

  const values = [id_usuario];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_getById(?)", values);
  return result;
};

export const getUsuarioAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_usuario";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_getAll(?,?,?,?,?)", values);
  return result;
};

export const countUsuarioAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Usuario_countAll(?)", values);
};

export const getUsuarioAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_AllForState(?)", values);
  return result;
};

export const changeStateUsuarioModel = async (id_usuario) => {
  id_usuario = id_usuario ?? "";

  const values = [id_usuario];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Usuario_changeState(?)", values);
  return result;
};
