"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSetup = exports.resetSetup = exports.getMetadata = void 0;
const database_1 = require("../config/database");
const createMetadata = async () => {
    try {
        await database_1.db.query("CREATE TABLE IF NOT EXISTS Metadata (SERCODIGO VARCHAR(50) PRIMARY KEY, SERNOME VARCHAR(255), SERCOMENTARIO VARCHAR(10000), SERATUALIZACAO TIMESTAMP, BASNOME VARCHAR(255), FNTSIGLA VARCHAR(50), FNTNOME VARCHAR(255), FNTURL VARCHAR(255), PERNOME VARCHAR(255), UNINOME VARCHAR(255), MULNOME VARCHAR(255), SERSTATUS VARCHAR(100), TEMCODIGO INTEGER, PAICODIGO VARCHAR(50), SERNUMERICA BOOLEAN)");
        console.log("Table Metadata created successfully!");
    }
    catch (err) {
        console.error("Error while creating Metadata: ", err);
    }
};
const deleteMetadata = async () => {
    try {
        await database_1.db.query("DROP TABLE IF EXISTS Metadata");
        console.log("Table Metadata dropped successfully!");
    }
    catch (err) {
        console.error("Error while dropping Metadata: ", err);
    }
};
const insertMetadata = async () => {
    try {
        const res = await fetch("http://www.ipeadata.gov.br/api/odata4/Metadados");
        const data = await res.json();
        const all_metadata = data['value'];
        for (const metadata of all_metadata) {
            await database_1.db.query("INSERT INTO Metadata VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [metadata['SERCODIGO'], metadata['SERNOME'], metadata['SERCOMENTARIO'], metadata['SERATUALIZACAO'], metadata['BASNOME'], metadata['FNTSIGLA'], metadata['FNTNOME'], metadata['FNTURL'], metadata['PERNOME'], metadata['UNINOME'], metadata['MULNOME'], metadata['SERSTATUS'], metadata['TEMCODIGO'], metadata['PAICODIGO'], metadata['SERNUMERICA']]);
        }
        console.log("All metadata inserted successfully!");
    }
    catch (err) {
        console.log(`Erro ao inserir os metadados: ${err}`);
    }
};
const getMetadata = async (req, res) => {
    try {
        const data = await database_1.db.query('SELECT * FROM Metadata');
        res.status(200).send({
            "message": "Metadata obtained successfully!",
            "metadata": data
        });
    }
    catch (err) {
        res.status(500).send({
            "message": "Erro ao obter os metadados",
            "error": err
        });
    }
};
exports.getMetadata = getMetadata;
const resetSetup = async (req, res) => {
    try {
        await deleteMetadata();
        res.status(200).send({
            "message": "Setup deleted successfully!"
        });
    }
    catch (err) {
        res.status(500).send({
            "message": "Error while deleting setup!",
            "error": err
        });
    }
};
exports.resetSetup = resetSetup;
const createHypertables = async () => {
    try {
        const all_metadata = await database_1.db.query('SELECT * FROM Metadata');
        for (const metadata of all_metadata) {
            await database_1.db.query(`CREATE TABLE IF NOT EXISTS ${metadata['SERNOME']} (VALDATA TIMESTAMP PRIMARY KEY, VALVALOR NUMERIC(20,8))`);
            await database_1.db.query(`SELECT create_hypertable('${metadata['SERNOME']}', 'VALDATA', if_not_exists => true)`);
        }
        console.log("Hypertables created successfully!");
    }
    catch (err) {
        console.log("Error while creating hypertables: ", err);
    }
};
const createSetup = async (req, res) => {
    try {
        await createMetadata();
        await insertMetadata();
        await createHypertables(req, res);
        res.status(201).send({
            "message": "Setup criado com sucesso!"
        });
    }
    catch (err) {
        res.status(500).send({
            "message": "Alguma coisa deu errada na criação do setup!",
            "error": err,
        });
    }
};
exports.createSetup = createSetup;
