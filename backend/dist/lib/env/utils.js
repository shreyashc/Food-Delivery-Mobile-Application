"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePort = exports.toBool = exports.toNumber = exports.getOsEnvArray = exports.getOsEnvOptional = exports.getOsEnv = void 0;
function getOsEnv(key) {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key];
}
exports.getOsEnv = getOsEnv;
function getOsEnvOptional(key) {
    return process.env[key];
}
exports.getOsEnvOptional = getOsEnvOptional;
function getOsEnvArray(key, delimiter = ",") {
    var _a;
    return (process.env[key] && ((_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.split(delimiter))) || [];
}
exports.getOsEnvArray = getOsEnvArray;
function toNumber(value) {
    return parseInt(value, 10);
}
exports.toNumber = toNumber;
function toBool(value) {
    return value === "true";
}
exports.toBool = toBool;
function normalizePort(port) {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) {
        return parsedPort;
    }
    return false;
}
exports.normalizePort = normalizePort;
//# sourceMappingURL=utils.js.map