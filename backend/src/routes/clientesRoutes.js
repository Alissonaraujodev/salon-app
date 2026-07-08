import { Router } from 'express'
import * as clientesController from '../controllers/clientesController.js'

const router = Router()

router.get('/', clientesController.listarClientes)
router.get('/:id', clientesController.buscarCliente)
router.post('/', clientesController.criarCliente)
router.put('/:id', clientesController.atualizarCliente)

export default router