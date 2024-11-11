"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
const admin = process.env.POSTGRES_ADMIN;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DB;
const db_port = process.env.POSTGRES_DB_PORT;
const host = process.env.POSTGRES_HOST;
const connectionString = `${admin}://${user}:${password}@${host}:${db_port}/${database}`;
const pool = new pg_1.Pool({
    connectionString: connectionString
});
console.log(`Pool criada com sucesso: ${JSON.stringify(pool)}`);
pool.connect((err) => {
    if (err) {
        console.error("Erro ao conectar com a base de dados", err);
    }
    else {
        console.log("Base de dados conectada com sucesso!");
    }
});
exports.db = {
    query: (text, params) => {
        return pool.query(text, params);
    }
};
