import {db} from '../config/database';

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

export const getMetadata = async (req:any, res: any) => {
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

export const resetSetup = async (req: any, res: any) => {
    try {
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

const createHypertables = async () => {
    try {
        const { rows } = await db.query('SELECT * FROM Metadata')
        // console.log(rows[0])
        for(const metadata of rows){
            console.log('A' + metadata['sercodigo'] + '_')
            await db.query(`CREATE TABLE IF NOT EXISTS ${'A' + metadata['sercodigo'] + '_'} (VALDATA TIMESTAMPTZ PRIMARY KEY, VALVALOR NUMERIC(20,8))`)
            console.log("Tabela criada!")
            await db.query(`SELECT create_hypertable('${'A' + metadata['sercodigo'] + '_'}', 'valdata', if_not_exists => true);`);
            console.log("Hipertabela criada!")
        }

        console.log("Hypertables created successfully!");
    } catch(err) {
        console.log("Error while creating hypertables: ", err)
    }
}


export const createSetup = async (req: any, res: any) => {
    try {
        await db.query('CREATE EXTENSION IF NOT EXISTS timescaledb;')
        await createMetadata()
        await insertMetadata()
        await createHypertables()
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