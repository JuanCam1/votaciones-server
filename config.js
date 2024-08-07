import "dotenv/config";

export const config = {
  PRODUCTION_DB: process.env.PRODUCTION_DB || "votaciones_db",
  DEVELOPMENT_DB: process.env.DEVELOPMENT_DB || "votaciones_db",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "JuanCamilo",
  DB_PASSWORD: process.env.DB_PASSWORD || "est@ndar2022**",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  ENVIRONMENT: process.env.ENVIRONMENT || "production",
  APP_PORT: process.env.APP_PORT || "1338",
  APP_PORT_DB: process.env.APP_PORT_DB || "3306",
  EMAIL: process.env.EMAIL || "sistemaintegraldeinformacionel@gmail.com",
  PASSWORD_EMAIL: process.env.PASSWORD_EMAIL || "SistemaIntegralInformacionElectoral1",
  PASSWORD_APPLICATION: process.env.PASSWORD_APPLICATION || "gpufdeigmhdssout"
};
