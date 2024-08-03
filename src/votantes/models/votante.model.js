import { db } from "../../../db/db.js";

export const isExistVotante = Object.freeze({
  document: "isExistDocument",
  emailPersonal: "isExistEmailPersonal",
  emailCorporativo: "isExistEmailCorporativo"
});

export const getVotanteIsExistModel = async (value, procedure) => {
  value = value ?? "";
  const values = [value];

  const promisePool = db.get().promise();

  switch (procedure) {
    case isExistVotante.document: {
      const result = await promisePool.query("CALL strp_Votante_isExistDocument(?)", values);
      return result;
    }
    case isExistVotante.emailPersonal: {
      const result = await promisePool.query("CALL strp_Votante_isExistEmailPersonal(?)", values);
      return result;
    }
    case isExistVotante.emailCorporativo: {
      const result = await promisePool.query(
        "CALL strp_Votante_isExistEmailCorporativo(?)",
        values
      );
      return result;
    }
  }
};

export const createVotanteModel = async (
  cedula_votante,
  fecha_expedicion_votante,
  fecha_nacimiento_votante,
  fecha_ingreso_votante,
  primer_nombre_votante,
  segundo_nombre_votante,
  primer_apellido_votante,
  segundo_apellido_votante,
  correo_corporativo_votante,
  correo_personal_votante,
  telefono_votante,
  carrera_votante,
  nombre_dependencia_votante,
  nombre_nivel_votante,
  codigo_cargo_votante,
  nombre_cargo_votante,
  grado_votante,
  codigo_categoria_votante,
  codigo_escalafon_votante,
  nombre_escalafon_votante,
  codigo_municipio_votante,
  nombre_municipio_votante,
  estado_id,
  role_id
) => {
  cedula_votante = cedula_votante ?? "";
  fecha_expedicion_votante = fecha_expedicion_votante ?? "";
  fecha_nacimiento_votante = fecha_nacimiento_votante ?? "";
  fecha_ingreso_votante = fecha_ingreso_votante ?? "";
  primer_nombre_votante = primer_nombre_votante ?? "";
  segundo_nombre_votante = segundo_nombre_votante ?? null;
  primer_apellido_votante = primer_apellido_votante ?? "";
  segundo_apellido_votante = segundo_apellido_votante ?? null;
  correo_corporativo_votante = correo_corporativo_votante ?? "";
  correo_personal_votante = correo_personal_votante ?? "";
  telefono_votante = telefono_votante ?? "";
  carrera_votante = carrera_votante ?? "";
  nombre_dependencia_votante = nombre_dependencia_votante ?? "";
  nombre_nivel_votante = nombre_nivel_votante ?? "";
  codigo_cargo_votante = codigo_cargo_votante ?? "";
  nombre_cargo_votante = nombre_cargo_votante ?? "";
  grado_votante = grado_votante ?? "";
  codigo_categoria_votante = codigo_categoria_votante ?? "";
  nombre_escalafon_votante = nombre_escalafon_votante ?? "";
  codigo_municipio_votante = codigo_municipio_votante ?? "";
  codigo_escalafon_votante = codigo_escalafon_votante ?? "";
  nombre_municipio_votante = nombre_municipio_votante ?? "";
  estado_id = estado_id ?? "";
  role_id = role_id ?? "";
  const values = [
    cedula_votante,
    fecha_expedicion_votante,
    fecha_nacimiento_votante,
    fecha_ingreso_votante,
    primer_nombre_votante,
    segundo_nombre_votante,
    primer_apellido_votante,
    segundo_apellido_votante,
    correo_corporativo_votante,
    correo_personal_votante,
    telefono_votante,
    carrera_votante,
    nombre_dependencia_votante,
    nombre_nivel_votante,
    codigo_cargo_votante,
    nombre_cargo_votante,
    grado_votante,
    codigo_categoria_votante,
    codigo_escalafon_votante,
    nombre_escalafon_votante,
    codigo_municipio_votante,
    nombre_municipio_votante,
    estado_id,
    role_id
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Votante_create(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    values
  );
  return result;
};

export const updateVotanteModel = async (
  id_votante,
  cedula_votante,
  fecha_expedicion_votante,
  fecha_nacimiento_votante,
  fecha_ingreso_votante,
  primer_nombre_votante,
  segundo_nombre_votante,
  primer_apellido_votante,
  segundo_apellido_votante,
  correo_corporativo_votante,
  correo_personal_votante,
  telefono_votante,
  carrera_votante,
  nombre_dependencia_votante,
  nombre_nivel_votante,
  codigo_cargo_votante,
  nombre_cargo_votante,
  grado_votante,
  codigo_categoria_votante,
  codigo_escalafon_votante,
  nombre_escalafon_votante,
  codigo_municipio_votante,
  nombre_municipio_votante
) => {
  id_votante = id_votante ?? "";
  cedula_votante = cedula_votante ?? "";
  fecha_expedicion_votante = fecha_expedicion_votante ?? "";
  fecha_nacimiento_votante = fecha_nacimiento_votante ?? "";
  fecha_ingreso_votante = fecha_ingreso_votante ?? "";
  primer_nombre_votante = primer_nombre_votante ?? "";
  segundo_nombre_votante = segundo_nombre_votante ?? null;
  primer_apellido_votante = primer_apellido_votante ?? "";
  segundo_apellido_votante = segundo_apellido_votante ?? null;
  correo_corporativo_votante = correo_corporativo_votante ?? "";
  correo_personal_votante = correo_personal_votante ?? "";
  telefono_votante = telefono_votante ?? "";
  carrera_votante = carrera_votante ?? "";
  nombre_dependencia_votante = nombre_dependencia_votante ?? "";
  nombre_nivel_votante = nombre_nivel_votante ?? "";
  codigo_cargo_votante = codigo_cargo_votante ?? "";
  nombre_cargo_votante = nombre_cargo_votante ?? "";
  grado_votante = grado_votante ?? "";
  codigo_categoria_votante = codigo_categoria_votante ?? "";
  nombre_escalafon_votante = nombre_escalafon_votante ?? "";
  codigo_municipio_votante = codigo_municipio_votante ?? "";
  codigo_escalafon_votante = codigo_escalafon_votante ?? "";
  nombre_municipio_votante = nombre_municipio_votante ?? "";
  const values = [
    id_votante,
    cedula_votante,
    fecha_expedicion_votante,
    fecha_nacimiento_votante,
    fecha_ingreso_votante,
    primer_nombre_votante,
    segundo_nombre_votante,
    primer_apellido_votante,
    segundo_apellido_votante,
    correo_corporativo_votante,
    correo_personal_votante,
    telefono_votante,
    carrera_votante,
    nombre_dependencia_votante,
    nombre_nivel_votante,
    codigo_cargo_votante,
    nombre_cargo_votante,
    grado_votante,
    codigo_categoria_votante,
    codigo_escalafon_votante,
    nombre_escalafon_votante,
    codigo_municipio_votante,
    nombre_municipio_votante
  ];

  const promisePool = db.get().promise();
  const result = await promisePool.query(
    "CALL strp_Votante_update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    values
  );
  return result;
};

export const getVotanteByIdModel = async (id_votante) => {
  id_votante = id_votante ?? "";

  const values = [id_votante];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votante_getById(?)", values);
  return result;
};

export const getVotanteAllModel = async (limit, offset, orderby, order, filter) => {
  limit = limit ?? "";
  offset = offset ?? "";
  orderby = orderby ?? "id_votante";
  order = order ?? "DESC";
  filter = filter ?? "";

  const values = [limit, offset, orderby, order, filter];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votante_getAll(?,?,?,?,?)", values);
  return result;
};

export const countVotanteAllModel = async (filter) => {
  filter = filter ?? "";
  const values = [filter];
  const promisePool = db.get().promise();
  return promisePool.query("CALL strp_Votantes_countAll(?)", values);
};

export const getVotanteAllByStateModel = async (state = "Todos") => {
  const values = [state];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votantes_AllForState(?)", values);
  return result;
};

export const changeStateVotanteModel = async (id_votante) => {
  id_votante = id_votante ?? "";

  const values = [id_votante];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votante_changeState(?)", values);
  return result;
};

export const getVotanteValidateModel = async (
  cedula_votante,
  correo_corporativo_votante,
  correo_personal_votante
) => {
  cedula_votante = cedula_votante ?? "";
  correo_corporativo_votante = correo_corporativo_votante ?? "";
  correo_personal_votante = correo_personal_votante ?? "";

  const values = [cedula_votante, correo_corporativo_votante, correo_personal_votante];

  const promisePool = db.get().promise();
  const result = await promisePool.query("CALL strp_Votante_validate(?,?,?)", values);
  return result;
};
