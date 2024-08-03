import { matchedData } from "express-validator";
import { sendErrorResponse, sendSuccesResponse } from "../../utils/sendResponse.js";
import { formatterCapitalize } from "../../utils/capitalize.js";
import { autoAdjustColumnWidth } from "../../utils/ajustColumn.js";
import {
  changeStateUsuarioModel,
  countUsuarioAllModel,
  createUsuarioModel,
  getUsuarioAllByStateModel,
  getUsuarioAllModel,
  getUsuarioByIdModel,
  getUsuarioIsExistModel,
  updateUsuarioModel
} from "../models/usuario.model.js";
import path from "path";
import fs from "fs";
import XlsxPopulate from "xlsx-populate";
import { hashPassword } from "../../utils/hashPassword.js";

const mimeTypes = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export const getImageUsuario = async (req, res) => {
  const { fileName } = matchedData(req);

  const filepath = path.join(process.cwd(), "uploads/photos/usuarios", fileName);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {

      return sendErrorResponse(res, 404, 301, filepath, req, null);
    }

    const ext = path.extname(filepath).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.sendFile(filepath);
  });
};

export const createUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const {
      cedula_usuario,
      nombre_usuario,
      lastname_usuario,
      correo_usuario,
      password_usuario,
      role_id,
      estado_id
    } = data;

    const nombreCap = formatterCapitalize(nombre_usuario.trim());
    const apellidoCap = formatterCapitalize(lastname_usuario.trim());

    const [[[cedulaId]]] = await getUsuarioIsExistModel(cedula_usuario, "cedula_usuario");
    const [[[correoId]]] = await getUsuarioIsExistModel(correo_usuario, "correo_usuario");

    if (cedulaId.result == -1) {
      return sendErrorResponse(res, 404, 402, "Cedula exists", req, data);
    }

    if (correoId.result == -1) {
      return sendErrorResponse(res, 404, 402, "Correo exists", req, data);
    }

    if (cedulaId.result == -2 || correoId.result == -2) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    const hashedPassword = await hashPassword(password_usuario);
    const photo = req?.file?.filename ?? "sinphoto.jpg";

    const [[[idUsuario]]] = await createUsuarioModel(
      cedula_usuario,
      nombreCap,
      apellidoCap,
      correo_usuario,
      hashedPassword,
      photo,
      role_id,
      estado_id
    );

    if (!idUsuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (idUsuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 500, 301, "Error in SQL", req, data);
      }
      case -3: {
        return sendErrorResponse(res, 500, 301, "Error durante ejecución", req, data);
      }
    }
    return sendSuccesResponse(res, 202, idUsuario, "admin", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const newPhoto = req?.file?.filename;

    const {
      idUsuario,
      cedula_usuario,
      nombre_usuario,
      lastname_usuario,
      correo_usuario,
      password_usuario,
      role_id
    } = data;

    const [[[usuario]]] = await getUsuarioByIdModel(idUsuario);

    if (!usuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (usuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Usuario no exist", req, data);
      }
    }

    const isValid = (value) => value.trim() !== "";

    const nombreCap = isValid(nombre_usuario)
      ? formatterCapitalize(nombre_usuario.trim())
      : usuario.nombre_usuario;

    const apelliCap = isValid(lastname_usuario)
      ? formatterCapitalize(lastname_usuario.trim())
      : usuario.lastname_usuario;

    const cedulaValid = isValid(cedula_usuario) ? cedula_usuario.trim() : usuario.cedula_usuario;

    const correoValid = isValid(correo_usuario) ? correo_usuario.trim() : usuario.correo_usuario;

    const roleValid = isValid(role_id) ? role_id : usuario.role_id;

    let hashedPassword;
    if (password_usuario && password_usuario.length > 0) {
      hashedPassword = await hashPassword(password_usuario);
    } else {
      hashedPassword = usuario.password_usuario;
    }

    if (usuario.foto_usuario !== "sinphoto.jpg") {
      if (newPhoto && usuario.foto_usuario) {
        fs.unlink(
          path.join(process.cwd(), "uploads/photos/usuarios", usuario.foto_usuario),
          (err) => {
            if (err) {
              return sendErrorResponse(res, 500, 301, "Error in update usuario", req, data);
            }
          }
        );
      }
    }

    const photo = newPhoto || usuario.foto_usuario;


    const [[[idUsuarioBD]]] = await updateUsuarioModel(
      idUsuario,
      cedulaValid,
      nombreCap,
      apelliCap,
      correoValid,
      hashedPassword,
      photo,
      roleValid
    );

    if (!idUsuarioBD) {
      return sendErrorResponse(res, 500, 402, "Error in database", req, data);
    }

    switch (idUsuarioBD.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error in database", req, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "Usuario no exist", req, data);
      }
    }

    return sendSuccesResponse(res, 202, "Usuario update", "admin", req,null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 402, "Error in service or database", req, data);
  }
};

export const getUsuarioAllStateController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[usuarios]] = await getUsuarioAllByStateModel(data.state);

    if (!usuarios) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (usuarios.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "No hay usuarios", req, data);
    }

    return sendSuccesResponse(res, 200, usuarios, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getUsuarioAllController = async (req, res) => {
  const data = matchedData(req);
  try {
    let filter = undefined;
    if (data.filter !== undefined) {
      filter = formatterCapitalize(data.filter);
    }

    let order_by = undefined;
    if (data.order_by !== undefined) {
      order_by = data.order_by;
    }

    const [[[usuariosCount]]] = await countUsuarioAllModel(filter);

    if (!usuariosCount) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (usuariosCount.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (usuariosCount.length == 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    const [[usuarios]] = await getUsuarioAllModel(
      data.limit,
      data.offset,
      order_by,
      data.order,
      filter
    );

    if (!usuarios) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (usuarios.length === 0) {
      return sendErrorResponse(res, 404, 301, "Is empty", req, data);
    }

    if (usuarios[0].result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(
      res,
      200,
      {
        count: usuariosCount.count,
        usuarios: usuarios
      },
      "api",
      req,
      null,
      data
    );
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getUsuarioByIdController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[[usuario]]] = await getUsuarioByIdModel(data.isUsuario);

    if (!usuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (usuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Usuario no exist", req, data);
      }
    }
    return sendSuccesResponse(res, 200, usuario, "api", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const changeStateUsuarioController = async (req, res) => {
  const data = matchedData(req);

  const [[[usuario]]] = await getUsuarioByIdModel(data.idUsuario);

  try {
    if (!usuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (usuario.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2:
        return sendErrorResponse(res, 404, 402, "Usuario no exist", req, data);
    }

    const [[[updateStateusuario]]] = await changeStateUsuarioModel(data.idUsuario);

    if (!updateStateusuario) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    if (updateStateusuario.result === -1) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    return sendSuccesResponse(res, 200, "update state", "admin", req, null, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const getDownloadExcelUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const [[usuarios]] = await getUsuarioAllByStateModel(data.state);

    if (!usuarios) return sendErrorResponse(res, 500, 301, "Error in database", req, data);

    switch (usuarios.result) {
      case -1:
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      case -2:
        return sendErrorResponse(res, 404, 402, "Usuarios no exist", req, data);
    }

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.row(1).style("bold", true);

    const headers = ["ID", "Nombre", "Cedula", "Correo", "Perfil", "Estado"];
    headers.forEach((header, idx) => {
      sheet
        .cell(1, idx + 1)
        .value(header)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    autoAdjustColumnWidth(sheet);

    usuarios.forEach((usuario, rowIndex) => {
      sheet
        .cell(rowIndex + 2, 1)
        .value(usuario.id_usuario)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 2)
        .value(`${usuario.nombre_usuario} ${usuario.lastname_usuario}`)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 3)
        .value(usuario.cedula_usuario)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 4)
        .value(usuario.correo_usuario)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 5)
        .value(usuario.nombre_role)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
      sheet
        .cell(rowIndex + 2, 6)
        .value(usuario.nombre_estado)
        .style({ horizontalAlignment: "center", verticalAlignment: "center" });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader("Content-Disposition", "attachment; filename=Usuarios.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database", req, data);
  }
};

export const updateNavbarUsuarioController = async (req, res) => {
  const data = matchedData(req);
  try {
    const newPhoto = req?.file?.filename;

    const { idUsuario, password_usuario } = data;

    const [[[user]]] = await getUsuarioByIdModel(idUsuario);

    if (!user) {
      return sendErrorResponse(res, 500, 301, "Error in database", req, data);
    }

    switch (user.result) {
      case -1: {
        return sendErrorResponse(res, 500, 301, "Error in database", req, data);
      }
      case -2: {
        return sendErrorResponse(res, 404, 402, "Usuario no exist", req, data);
      }
    }


    let hashedPassword;
    if (password_usuario && password_usuario.length > 0) {
      hashedPassword = await hashPassword(password_usuario);
    } else {
      hashedPassword = user.password_usuario;
    }

    let photo;
    if (newPhoto) {
      if (user.foto_usuario !== "sinphoto.jpg") {
        fs.unlink(path.join(process.cwd(), "uploads/photos/usuarios", user.foto_usuario), (err) => {
          if (err) {
            return sendErrorResponse(res, 500, 301, "Error deleting old image", req, data);
          }
        });
        photo = newPhoto;
      } else {
        photo = newPhoto;
      }
    } else {
      photo = user.foto_usuario;
    }

    const [[[idUserDb]]] = await updateUsuarioModel(
      idUsuario,
      user.cedula_usuario,
      user.nombre_usuario,
      user.lastname_usuario,
      user.correo_usuario,
      hashedPassword,
      photo,
      user.role_id
    );

    if (!idUserDb) return sendErrorResponse(res, 500, 301, "Error in database");

    switch (idUserDb.result) {
      case -1: {
        return sendErrorResponse(res, 500, 402, "Error database", req, data);
      }
      case -10: {
        return sendErrorResponse(res, 500, 301, "User no exist", req, data);
      }
    }

    return sendSuccesResponse(res, 202, "user update", "api", req, data);
  } catch (error) {
    return sendErrorResponse(res, 500, 301, "Error in service or database");
  }
};
