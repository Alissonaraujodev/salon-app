import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Carrega as variáveis do arquivo .env para process.env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globais
// cors() → permite que o frontend (porta 5173) acesse este servidor (porta 3001)
// express.json() → permite que o servidor entenda JSON no corpo das requisições
app.use(cors())
app.use(express.json())

// Rota de teste para confirmar que o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Salão funcionando! 💇‍♀️' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})