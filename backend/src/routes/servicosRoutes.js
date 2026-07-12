import { Router } from 'express'
import * as servicosController from '../controllers/servicosController.js'

const router = Router()

router.get('/', servicosController.listarServicos)
router.get('/buscar/:nome', servicosController.buscarServicoPorNome)
router.get('/:id', servicosController.buscarServico)
router.post('/', servicosController.criarServico)
router.put('/:id', servicosController.atualizarServico)

export default router