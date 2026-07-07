import { Router } from 'express'
import * as servicosController from '../controllers/servicosController.js'

const router = Router()

// GET /api/servicos → lista todos
router.get('/', servicosController.listarServicos)

// GET /api/servicos/3 → busca o serviço de id 3
router.get('/:id', servicosController.buscarServico)

// POST /api/servicos → cria um novo
router.post('/', servicosController.criarServico)

export default router