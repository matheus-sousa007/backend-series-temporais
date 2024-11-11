"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get('/api', (req, res) => {
    res.status(200).send({
        success: true,
        message: "Seja bem-vindo(a) a API Node.js + PostgreSQL",
        version: '1.0.0'
    });
});
