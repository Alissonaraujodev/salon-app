import { Router } from 'express'
import * as profissionaisController from '../controllers/profissionaisController.js'
import { autenticar, autorizar } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', profissionaisController.listarProfissionais)
router.get('/buscar/:nome', profissionaisController.buscarProfissionalPorNome)
router.get('/:id', profissionaisController.buscarProfissional)
router.post('/', autenticar, autorizar('administrador'), profissionaisController.criarProfissional)
router.put('/:id', profissionaisController.atualizarProfissional)

export default router