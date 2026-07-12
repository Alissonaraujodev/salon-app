import { Router } from 'express'
import * as profissionaisController from '../controllers/profissionaisController.js'

const router = Router()

router.get('/', profissionaisController.listarProfissionais)
router.get('/buscar/:nome', profissionaisController.buscarProfissionalPorNome)
router.get('/:id', profissionaisController.buscarProfissional)
router.post('/', profissionaisController.criarProfissional)
router.put('/:id', profissionaisController.atualizarProfissional)

export default router