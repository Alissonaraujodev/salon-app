import { Router } from 'express'
import * as agendamentosController from '../controllers/agendamentosController.js'

const router = Router()

router.get('/', agendamentosController.listarAgendamentos)
router.get('/:id', agendamentosController.buscarAgendamentoPorId)
router.get('/cliente/:clienteId', agendamentosController.listarAgendamentosPorCliente)
router.post('/', agendamentosController.criarAgendamento)
router.patch('/:id/status', agendamentosController.atualizarStatus)

export default router