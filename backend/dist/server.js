"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
const entities_1 = require("./models/entities/");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const conn = yield typeorm_1.createConnection({
        type: "postgres",
        host: env_1.env.db.host,
        port: env_1.env.db.port,
        database: env_1.env.db.databaseName,
        username: env_1.env.db.username,
        password: env_1.env.db.password,
        logging: env_1.env.db.logging,
        synchronize: env_1.env.db.synchronize,
        entities: [entities_1.User, entities_1.Customer, entities_1.Restaurant],
        ssl: {
            rejectUnauthorized: false,
        },
    });
    console.log("db connection = " + conn.isConnected);
    const port = env_1.env.app.port || 4000;
    app.set("port", port);
    app.listen(port, () => {
        console.log("Server started on Port", port);
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=server.js.map