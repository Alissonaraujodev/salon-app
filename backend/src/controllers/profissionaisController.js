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
    const nome = req.body.nome?.trim()
    const telefone = req.body.telefone?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const senha = req.body.senha
    const cargo = req.body.cargo?.trim()
    const especialidade = req.body.especialidade?.trim()

    if (!nome || !telefone || !email || !senha || !cargo ) {
      return res.status(400).json({ erro: 'Nome, telefone, email, senha e cargo são obrigatórios' })
    }

    const telefoneLimpo = telefone.replace(/\D/g, '')

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return res.status(400).json({
        erro: 'Telefone inválido.'
      })  
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!regexEmail.test(email)) {
      return res.status(400).json({
        erro: 'Email inválido.'
      })
    }

    if (senha.length < 8) {
      return res.status(400).json({
        erro: 'A senha deve ter no mínimo 8 caracteres.'
      })
    }

    const regexSenha =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).+$/

    if (!regexSenha.test(senha)) {
      return res.status(400).json({
        erro: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
      })
    }

    const profissionalExistente = await profissionaisService.buscarProfissionalPorEmail(email)
    if (profissionalExistente) {
      return res.status(409).json({ erro: 'Já existe um profissional com esse email' })
    }

    const novoProfissional = await profissionaisService.criarProfissional({ nome, telefone, email, senha, cargo, especialidade })
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