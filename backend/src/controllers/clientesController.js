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
    const data_nascimento = req.body.data_nascimento || null
    const observacoes = req.body.observacoes?.trim() || null

    if (!nome || !telefone) {
      return res.status(400).json({ erro: 'Nome, telefone são obrigatórios' })
    }

    const telefoneLimpo = telefone.replace(/\D/g, '')

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return res.status(400).json({
        erro: 'Telefone inválido.'
      })  
    }

    const clienteExistente = await clientesService.buscarClientePorTelefone(telefone)
    if (clienteExistente) {
      return res.status(409).json({ erro: 'Já existe um cliente com esse telefone' })
    }

    const novoCliente = await clientesService.criarCliente({ nome, telefone, data_nascimento, observacoes })
    res.status(201).json(novoCliente)
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function atualizarCliente(req, res) {
  try {
    const { id } = req.params
    const { nome, telefone, data_nascimento, observacoes } = req.body

    if (!nome || !telefone) {
      return res.status(400).json({ erro: 'Nome e telefone  são obrigatórios' })
    }

    // Verifica se o cliente existe antes de tentar atualizar
    const clienteExistente = await clientesService.buscarClientePorId(id)
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' })
    }
   
    const outroClienteComTelefone = await clientesService.buscarClientePorTelefone(telefone)
      if (outroClienteComTelefone && outroClienteComTelefone.id !== Number(id)) {
        return res.status(409).json({ erro: 'Já existe outro cliente com esse telefone' })
    }

    const clienteAtualizado = await clientesService.atualizarCliente(id, { nome, telefone, data_nascimento, observacoes })
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