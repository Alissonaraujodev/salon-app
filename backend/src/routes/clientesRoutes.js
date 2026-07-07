import { Router } from 'express'
import * as clientesController from '../controllers/clientesController.js'

const router = Router()

// POST /api/servicos → cria um novo
router.post('/', clientesController.criarCliente)

export default router