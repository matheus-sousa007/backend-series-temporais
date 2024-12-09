import express from 'express';

import {db} from '../config/database';
import { splitTimestamp } from '../utils';

const createMetadata = async () => {
    try {
        await db.query("CREATE TABLE IF NOT EXISTS Metadata (SERCODIGO VARCHAR(50) PRIMARY KEY, SERNOME VARCHAR(255), SERCOMENTARIO VARCHAR(10000), SERATUALIZACAO TIMESTAMPTZ, BASNOME VARCHAR(255), FNTSIGLA VARCHAR(50), FNTNOME VARCHAR(255), FNTURL VARCHAR(255), PERNOME VARCHAR(255), UNINOME VARCHAR(255), MULNOME VARCHAR(255), SERSTATUS VARCHAR(100), TEMCODIGO INTEGER, PAICODIGO VARCHAR(50), SERNUMERICA BOOLEAN)")
        console.log("Table Metadata created successfully!")        
    } catch( err ) {
        console.error("Error while creating Metadata: ", err)
    }
}

const deleteMetadata = async () => {
    try {
        await db.query("DROP TABLE IF EXISTS Metadata")
        console.log("Table Metadata dropped successfully!")        
    } catch( err ) {
        console.error("Error while dropping Metadata: ", err)
    }
}

const insertMetadata = async () => {
    try{
        const res = await fetch("http://www.ipeadata.gov.br/api/odata4/Metadados")
        const data = await res.json() as any

        const all_metadata = data['value'] as any
        
        for(const metadata of all_metadata) {
            await db.query("INSERT INTO Metadata VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [metadata['SERCODIGO'], metadata['SERNOME'], metadata['SERCOMENTARIO'], metadata['SERATUALIZACAO'], metadata['BASNOME'], metadata['FNTSIGLA'], metadata['FNTNOME'], metadata['FNTURL'], metadata['PERNOME'], metadata['UNINOME'], metadata['MULNOME'], metadata['SERSTATUS'], metadata['TEMCODIGO'], metadata['PAICODIGO'], metadata['SERNUMERICA']])
        }
        console.log("All metadata inserted successfully!")
    }catch(err){
        console.log(`Erro ao inserir os metadados: ${err}`)
    }
}

const createHypertables = async () => {
    try {
        const { rows } = await db.query('SELECT * FROM Metadata')
        // console.log(rows[0])
        for(const metadata of rows){
            console.log('a' + metadata['sercodigo'] + '_')
            await db.query(`CREATE TABLE IF NOT EXISTS ${'a' + metadata['sercodigo'] + '_'} (VALDATA TIMESTAMPTZ NOT NULL, YEAR INTEGER NOT NULL, MONTH INTEGER NOT NULL, DAY INTEGER NOT NULL, HOUR INTEGER NOT NULL, MINUTES INTEGER NOT NULL, SECONDS INTEGER NOT NULL, VALVALOR NUMERIC(20,8), NIVNOME TEXT, TERCODIGO TEXT)`)
            console.log("Tabela criada!")
            await db.query(`SELECT create_hypertable('${'a' + metadata['sercodigo'] + '_'}', 'valdata', if_not_exists => true);`);
            console.log("Hipertabela criada!")
        }

        // console.log("Tables created successfully!")
        console.log("Hypertables created successfully!");
    } catch(err) {
        console.error("Error while creating hypertables: ", err)
        // console.error("Error while creating tables: ", err)
    }
}

const deleteHypertables = async () => {
    try {
        const { rows } = await db.query('SELECT * FROM Metadata')
        for(const metadata of rows) {
            await db.query(`DROP TABLE IF EXISTS ${'a' + metadata['sercodigo'] + '_'}`)
        }
        console.log("Hipertabelas deletadas!")
        // console.log("Tabelas deletadas!")
    } catch(err) {
        console.error("Erro durante drop das hipertabelas: ", err)
        // console.error("Erro durante drop das tabelas: ", err)
    }
}

const insertTimeSeriesData = async (time_series_code: string) => {
    try {
        const res = await fetch(`http://www.ipeadata.gov.br/api/odata4/Metadados('${time_series_code.slice(1, -1)}')/Valores`)
        const resjson = await res.json() as any;
        const data = resjson['value']

        for(const line of data){
            const time_split = splitTimestamp(line['VALDATA'])
            await db.query(`INSERT INTO ${'a' + time_series_code.toLowerCase() + '_'} VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [line['VALDATA'], time_split['year'], time_split['month'], time_split['day'], time_split['hour'], time_split['minutes'], time_split['seconds'], line['VALVALOR'], line['NIVNOME'] === '' ? undefined : line['NIVNOME'], line['TERCODIGO'] === '' ? undefined : line['TERCODIGO']])
        }
    }catch(err) {
        console.error(`Erro ao inserir a série ${time_series_code}: ${err}`)
        return false;
    }

    return true;
}

const insertAllTimeSeriesData = async () => {
    let series = 0;
    try{
        const { rows } = await db.query('SELECT * FROM Metadata');
        for(const metadata of rows){
            while(!await insertTimeSeriesData(metadata['sercodigo'])) {console.log("Tentando denovo!")};
            series += 1;

            if(series % 25 === 0) console.log(`Quantidade de séries inseridas: ${series}`)

        }
        console.log("Todas as linhas foram inseridas com sucesso!");
    }catch(err) {
        console.error(`Não foi possível inserir todas as séries: ${err}`)
    }
}


export const getMetadata = async (req: express.Request, res: express.Response) => {
    try{
        const data = await db.query('SELECT * FROM Metadata')
        res.status(200).send({
            "message": "Metadata obtained successfully!",
            "metadata": data
        })
    } catch(err) {
        res.status(500).send({
            "message": "Erro ao obter os metadados",
            "error": err
        })
    }
}

export const getMetadataById = async (req: express.Request, res: express.Response) => {
    const searchParams = new URLSearchParams(req.params as any);
    const codename = searchParams.get('id');
    
    try {
        const { rows } = await db.query("SELECT * FROM Metadata WHERE sercodigo = $1", [codename])
        res.status(200).send({
            "message": "Metadata got successfully!",
            "metadata": rows
        })
    } catch(err) {
        res.status(500).send({
            "message": "Error while getting metadata!",
            "error": err
        })
    }
}


export const resetSetup = async (req: express.Request, res: express.Response) => {
    try {
        await deleteHypertables()
        await deleteMetadata()
        res.status(200).send({
            "message": "Setup deleted successfully!"
        })
    } catch (err) {
        res.status(500).send({
            "message": "Error while deleting setup!",
            "error": err
        })
    }
}


export const createSetup = async (req: express.Request, res: express.Response) => {
    try {
        await db.query('CREATE EXTENSION IF NOT EXISTS timescaledb;')
        await createMetadata()
        await insertMetadata()
        await createHypertables()
        await insertAllTimeSeriesData()
        res.status(201).send({
            "message": "Setup criado com sucesso!"
        })
    } catch(err){
        res.status(500).send({
            "message": "Alguma coisa deu errada na criação do setup!",
            "error": err,
        })
    }
}

export const checkIfTableExists = async (req: express.Request, res: express.Response) => {
    const searchParams = new URLSearchParams(req.params as any);
    const tablename = searchParams.get('tablename');

    try {
        const { rows } = await db.query("SELECT hypertable_name FROM timescaledb_information.hypertables WHERE hypertable_name = $1", ['a' + tablename!.toLowerCase() + '_']);
        res.status(200).send({
            "message": `Information Schema got successfully!`,
            "rows": rows
        })
    } catch(err){
        res.status(500).send({
            "message": "Error while getting information schema!",
            "error": err
        })
    }
}