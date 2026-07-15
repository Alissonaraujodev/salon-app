import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import servicosRoutes from './routes/servicosRoutes.js'
import clientesRoutes from './routes/clientesRoutes.js'
import profissionaisRoutes from './routes/profissionaisRoutes.js'
import agendamentosRoutes from './routes/agendamentosRoutes.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

// Rotas
app.use('/api/servicos', servicosRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/profissionais', profissionaisRoutes)
app.use('/api/agendamentos', agendamentosRoutes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Salão funcionando! 💇‍♀️' })
})

export default app