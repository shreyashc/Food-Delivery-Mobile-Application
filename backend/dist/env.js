"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
const env_1 = require("./lib/env/");
dotenv.config();
exports.env = {
    node: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
    isDevelopment: process.env.NODE_ENV === "development",
    app: {
        port: env_1.normalizePort(process.env.PORT),
        dirs: {},
    },
    db: {
        host: env_1.getOsEnvOptional("DB_HOST"),
        uri: env_1.getOsEnv("DB_URI"),
        port: env_1.toNumber(env_1.getOsEnvOptional("DB_PORT")),
        username: env_1.getOsEnvOptional("DB_USERNAME"),
        password: env_1.getOsEnvOptional("DB_PASSWORD"),
        databaseName: env_1.getOsEnv("DB_NAME"),
        synchronize: env_1.toBool(env_1.getOsEnvOptional("TYPEORM_SYNCHRONIZE")),
        logging: env_1.toBool(env_1.getOsEnv("TYPEORM_LOGGING")),
    },
};
//# sourceMappingURL=env.js.map