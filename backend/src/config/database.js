import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// createPool em vez de createConnection:
// Um "pool" mantém várias conexões abertas e reutiliza elas.
// Isso é muito mais eficiente do que abrir e fechar uma conexão
// em cada requisição que chegar na API.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,  // espera uma conexão ficar livre em vez de dar erro
  connectionLimit: 10,       // máximo de 10 conexões simultâneas
})

export default pool