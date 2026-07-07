import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/database.js'   // <- adicione essa linha
import servicosRoutes from './routes/servicosRoutes.js'  // <- adicione
import clientesRoutes from './routes/clientesRoutes.js'

// Carrega as variáveis do arquivo .env para process.env
dotenv.config()

// Testa a conexão com o banco ao iniciar o servidor
pool.getConnection()
  .then(conn => {
    console.log('Banco de dados conectado com sucesso!')
    conn.release() // devolve a conexão pro pool depois de testar
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err.message)
  })

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globais
// cors() → permite que o frontend (porta 5173) acesse este servidor (porta 3001)
// express.json() → permite que o servidor entenda JSON no corpo das requisições
app.use(cors())
app.use(express.json())

// O prefixo '/api/servicos' aqui + a rota '/' no router = GET /api/servicos
app.use('/api/servicos', servicosRoutes)  // <- adicione
app.use('/api/clientes', clientesRoutes)

// Rota de teste para confirmar que o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Salão funcionando! 💇‍♀️' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})