import { db } from "../../../db/db.js";

export const getEleccionIsExistModel = async (nombre_eleccion) => {
  nombre_eleccion = nombre_eleccion ?? "";
  const values = [nombre_eleccion];

  const promisePool = db.get().promise();

  const result = await promisePool.query("CALL strp_Eleccion_isExistName(?)", values);
  return result;
};

export const createEleccionModel = async (
  nombre_eleccion,
  descripcion_eleccion,
  fecha_ini_eleccion,
  fecha_fin_eleccion,
  hora_ini_eleccion,
  hora_fin_eleccion,
  estado_id
) => {
  nombre_eleccion = nombre_eleccion ?? "";
  descripcion_eleccion = descripcion_eleccion ?? "";
  fecha_ini_eleccion = fecha_ini_eleccion ?? "";
  fecha_fin_eleccion = fecha_fin_eleccion ?? "";
  hora_ini_eleccion = hora_ini_eleccion ?? "";
  hora_fin_eleccion = hora_fin_eleccion ?? "";
  estado_id = estado_id ?? "";

  const values = [
    nombre_eleccion,
    descripcion_eleccion,
    fecha_ini_eleccion,
    fecha_fin_eleccion,
    hora_ini_eleccion,
    hora_fin_eleccion,
    estado_id
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_create(?,?,?,?,?,?,?)", values);
  return result;
};

export const updateEleccionModel = async (
  id_eleccion,
  nombre_eleccion,
  descripcion_eleccion,
  fecha_ini_eleccion,
  fecha_fin_eleccion,
  hora_ini_eleccion,
  hora_fin_eleccion
) => {
  id_eleccion = id_eleccion ?? "";
  nombre_eleccion = nombre_eleccion ?? "";
  descripcion_eleccion = descripcion_eleccion ?? "";
  fecha_ini_eleccion = fecha_ini_eleccion ?? "";
  fecha_fin_eleccion = fecha_fin_eleccion ?? "";
  hora_ini_eleccion = hora_ini_eleccion ?? "";
  hora_fin_eleccion = hora_fin_eleccion ?? "";

  const values = [
    id_eleccion,
    nombre_eleccion,
    descripcion_eleccion,
    fecha_ini_eleccion,
    fecha_fin_eleccion,
    hora_ini_eleccion,
    hora_fin_eleccion
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_update(?,?,?,?,?,?,?)", values);
  return result;
};

export const getEleccionByIdModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_getById(?)", values);
  return result;
};

export const getEleccionAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_eleccion";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_getAll(?,?,?,?,?)", values);
  return result;
};

export const countEleccionAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Eleccion_countAll(?)", values);
};

export const getEleccionAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_AllForState(?)", values);
  return result;
};

export const changeStateEleccionModel = async (id_eleccion) => {
  id_eleccion = id_eleccion ?? "";

  const values = [id_eleccion];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Eleccion_changeState(?)", values);
  return result;
};
