import cron from "node-cron";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import { sendErrorResponse } from "../utils/sendResponse.js";
import routerFiles from "../uploadsFile/routes/uploadsFile.router.js";
import routerEstado from "../estado/routes/estado.router.js";
import routerEleccion from "../elecciones/routes/eleccion.router.js";
import routerRole from "../role/routes/role.router.js";
import routerVotantes from "../votantes/routes/votante.router.js";
import routerCandidato from "../candidatos/routes/candidato.router.js";
import routerUsuario from "../usuario/routes/usuario.router.js";
import routerEleccionVotante from "../eleccionVotante/routes/eleccion-votante.router.js";
import routerEleccionCandidato from "../eleccionCandidato/routes/eleccion-candidato.router.js";
import routerLogin from "../login/routes/login.router.js";
import routerReporte from "../reportes/routes/reporte.router.js";
import routerVotacion from "../votacion/routes/votacion.router.js";
import {
  changeStateEleccionModel,
  getEleccionAllByStateModel
} from "../elecciones/models/eleccion.model.js";
import { isBefore, parseISO } from "date-fns";
import routerEleccionUsuario from "../eleccionUsuario/routes/eleccion-usuario.router.js";
import {
  changeEleccionesPorEleccionUsuarioModel,
  changeEleccionesPorEleccionVotanteModel,
  eleccionesPorEleccionVotanteModel
} from "../eleccionVotante/models/eleccion-votante.model.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());

app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  console.log("🏈 Solicitud recibida:", req.method, req.url);
  // console.log("🏈 Solicitud recibida:", req.body);
  // console.log("🏈 Solicitud recibida:", req.params);
  // console.log('🏈 Solicitud recibida:', req.body, req.headers);
  // console.log('🏈 Solicitud recibida:', req.headers);
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendErrorResponse(res, 400, 201, "Request has invalid data");
  }
  next();
});

app.use("/estado", routerEstado);
app.use("/role", routerRole);
app.use("/eleccion", routerEleccion);
app.use("/votante", routerVotantes);
app.use("/candidato", routerCandidato);
app.use("/usuario", routerUsuario);
app.use("/eleccion-votante", routerEleccionVotante);
app.use("/eleccion-candidato", routerEleccionCandidato);
app.use("/eleccion-usuario", routerEleccionUsuario);
app.use("/login", routerLogin);
app.use("/files", routerFiles);
app.use("/reportes", routerReporte);
app.use("/votacion", routerVotacion);

cron.schedule("*/1 * * * *", async () => {
  try {
    const [[elecciones]] = await getEleccionAllByStateModel("Activo");

    const now = new Date();
    for (const eleccion of elecciones) {
      const fechaFin = parseISO(`${eleccion.fecha_fin_eleccion}T${eleccion.hora_fin_eleccion}:00`);
      if (!isBefore(now, fechaFin)) {
        try {
          await changeStateEleccionModel(eleccion.id_eleccion);
          await changeEleccionesPorEleccionVotanteModel(eleccion.id_eleccion);
          await changeEleccionesPorEleccionUsuarioModel(eleccion.id_eleccion);

          console.log(
            `La elección ${eleccion.nombre_eleccion} ha finalizado y se ha cambiado a inactivo.`
          );
        } catch (error) {
          throw Error("Error al actualizar el estado");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});
export default app;