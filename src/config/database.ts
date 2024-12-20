import { Pool } from 'pg';
import dotenv from 'dotenv';

// dotenv.config({ path: '.env.local'});

// const admin = process.env.POSTGRES_ADMIN || "postgres";
// const user = process.env.POSTGRES_USER || "postgres";
// const password = process.env.POSTGRES_PASSWORD;
// const database = process.env.POSTGRES_DB;
// const db_port = process.env.POSTGRES_DB_PORT || 5432;
// const host = process.env.POSTGRES_HOST || "postgres";

// const connectionString = `${admin}://${user}:${password}@${host}:${db_port}/${database}`

const connectionString = process.env.DATABASE_URL

console.log(`Connection string: ${connectionString}`)

console.log(`All environment variables: ${JSON.stringify(process.env)}`)

const pool = new Pool({
    connectionString:  connectionString
});

console.log(`Pool criada com sucesso: ${JSON.stringify(pool)}`)

pool.connect((err) => {
    if (err) {
        console.error("Erro ao conectar com a base de dados", err);
    }
    else{
        console.log("Base de dados conectada com sucesso!")
    }
})

export const db = {
    query: (text: string, params?: any[]): Promise<any> => {
        return pool.query(text, params);
    }
}