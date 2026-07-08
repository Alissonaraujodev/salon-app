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
    // req.body contém o JSON enviado no corpo da requisição
    const { nome,telefone, email } = req.body

    // Validação básica — campos obrigatórios
    if (!nome || !telefone || !email) {
      // 400 = Bad Request (o cliente mandou dados inválidos)
      return res.status(400).json({ erro: 'Nome, telefone e email são obrigatórios' })
    }

    // Verifica se já existe um cliente com esse email antes de tentar inserir
    const clienteExistente = await clientesService.buscarClientePorEmail(email)
    if (clienteExistente) {
      return res.status(409).json({ erro: 'Já existe um cliente com esse email' })
    }

    const novoCliente = await clientesService.criarCliente({ nome, telefone, email })
    // 201 = Created (diferente do 200, indica que algo foi criado)
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