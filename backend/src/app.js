import express from 'express'
import cors from 'cors'

import servicosRoutes from './routes/servicosRoutes.js'
import clientesRoutes from './routes/clientesRoutes.js'
import profissionaisRoutes from './routes/profissionaisRoutes.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/servicos', servicosRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/profissionais', profissionaisRoutes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Salão funcionando! 💇‍♀️' })
})

export default app