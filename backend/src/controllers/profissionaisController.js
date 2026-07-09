import * as profissionaisService from '../services/profissionaisService.js'

async function listarProfissionais(req, res) {
  try {
    const profissionais = await profissionaisService.listarProfissionais()
    res.json(profissionais)
  } catch (error) {
    console.error('Erro ao listar profissionais:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function buscarProfissional(req, res) {
  try {
    const { id } = req.params
    const profissional = await profissionaisService.buscarProfissionalPorId(id)

    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado' })
    }

    res.json(profissional)
  } catch (error) {
    console.error('Erro ao buscar profissional:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function buscarProfissionalPorNome(req, res) {
  try {
    const { nome } = req.params
    const profissional = await profissionaisService.buscarProfissionalPorNome(nome)

    if (profissional.length === 0) {
      return res.status(404).json({ erro: 'Profissional não encontrado' })
    }

    res.json(profissional)
  } catch (error) {
    console.error('Erro ao buscar profissional:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function criarProfissional(req, res) {
  try {
    const { nome,telefone, email, cargo, especialidade } = req.body

    // Validação básica — campos obrigatórios
    if (!nome || !telefone || !email || !cargo || !especialidade) {
      return res.status(400).json({ erro: 'Nome, telefone, email, cargo e especialidade são obrigatórios' })
    }

    // Verifica se já existe um Profissional com esse email antes de tentar inserir
    const profissionalExistente = await profissionaisService.buscarProfissionalPorEmail(email)
    if (profissionalExistente) {
      return res.status(409).json({ erro: 'Já existe um profissional com esse email' })
    }

    const novoProfissional = await profissionaisService.criarProfissional({ nome, telefone, email, cargo, especialidade })
    // 201 = Created (diferente do 200, indica que algo foi criado)
    res.status(201).json(novoProfissional)
  } catch (error) {
    console.error('Erro ao criar profissional:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function atualizarProfissional(req, res) {
  try {
    const { id } = req.params
    const { nome, telefone, email, cargo, especialidade, ativo } = req.body

    if (!nome || !telefone || !email || !cargo || !especialidade || ativo === undefined) {
      return res.status(400).json({ erro: 'Nome, telefone, email, cargo e especiacidade são obrigatórios' })
    }

    // Verifica se o Profissional existe antes de tentar atualizar
    const profissionalExistente = await profissionaisService.buscarProfissionalPorId(id)
    if (!profissionalExistente) {
      return res.status(404).json({ erro: 'Profissional não encontrado' })
    }

    const profissionalAtualizado = await profissionaisService.atualizarProfissional(id, { nome, telefone, email, cargo, especialidade, ativo })
    res.json(profissionalAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

export{
  listarProfissionais,
  buscarProfissional,
  buscarProfissionalPorNome,
  criarProfissional,
  atualizarProfissional
}