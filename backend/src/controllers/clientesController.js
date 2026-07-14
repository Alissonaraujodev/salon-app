import * as clientesService from '../services/clientesService.js'

async function listarClientes(req, res) {
  try {
    const clientes = await clientesService.listarClientes()
    res.json(clientes)
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function buscarCliente(req, res) {
  try {
    const { id } = req.params
    const cliente = await clientesService.buscarClientePorId(id)

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' })
    }

    res.json(cliente)
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function criarCliente(req, res) {
  try {
    const nome = req.body.nome?.trim()
    const telefone = req.body.telefone?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const senha = req.body.senha

    if (!nome || !telefone || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, telefone, email e senha são obrigatórios' })
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

    const clienteExistente = await clientesService.buscarClientePorEmail(email)
    if (clienteExistente) {
      return res.status(409).json({ erro: 'Já existe um cliente com esse email' })
    }

    const novoCliente = await clientesService.criarCliente({ nome, telefone, email, senha })
    res.status(201).json(novoCliente)
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function atualizarCliente(req, res) {
  try {
    const { id } = req.params
    const { nome, telefone, email } = req.body

    if (!nome || !telefone || !email) {
      return res.status(400).json({ erro: 'Nome, telefone e email são obrigatórios' })
    }

    // Verifica se o cliente existe antes de tentar atualizar
    const clienteExistente = await clientesService.buscarClientePorId(id)
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' })
    }

    const clienteAtualizado = await clientesService.atualizarCliente(id, { nome, telefone, email })
    res.json(clienteAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

export{
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente
}