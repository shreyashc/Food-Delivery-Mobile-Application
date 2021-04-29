import * as dotenv from "dotenv";

import {
  getOsEnv,
  getOsEnvOptional,
  normalizePort,
  toBool,
  toNumber,
} from "./lib/env/";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  app: {
    port: normalizePort(process.env.PORT!),
    // origin: getOsEnv("FRONTEND_ORIGIN"),
    cookieName: getOsEnv("AUTH_COOKIE_NAME"),
    // cookieSecret: getOsEnv("COOKIE_SECRET"),
    accessTokenSecret: getOsEnv("ACCESS_TOKEN_SECRET"),
    dirs: {
      /*  migrations: getOsPaths("TYPEORM_MIGRATIONS"),
      migrationsDir: getOsPath("TYPEORM_MIGRATIONS_DIR"),
      entities: getOsPaths("TYPEORM_ENTITIES"),
      entitiesDir: getOsPath("TYPEORM_ENTITIES_DIR"), */
    },
  },

  db: {
    host: getOsEnvOptional("DB_HOST"),
    uri: getOsEnv("DB_URI"),
    port: toNumber(getOsEnvOptional("DB_PORT")!),
    username: getOsEnvOptional("DB_USERNAME"),
    password: getOsEnvOptional("DB_PASSWORD"),
    databaseName: getOsEnv("DB_NAME"),
    synchronize: toBool(getOsEnvOptional("TYPEORM_SYNCHRONIZE")!),
    logging: toBool(getOsEnv("TYPEORM_LOGGING")),
  },
};
