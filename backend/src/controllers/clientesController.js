import * as clientesService from '../services/clientesService.js'

async function criarCliente(req, res) {
  try {
    // req.body contém o JSON enviado no corpo da requisição
    const { nome,telefone, email } = req.body

    // Validação básica — campos obrigatórios
    if (!nome || !telefone || !email) {
      // 400 = Bad Request (o cliente mandou dados inválidos)
      return res.status(400).json({ erro: 'Nome, telefone e email são obrigatórios' })
    }

    const novoCliente = await clientesService.criarCliente({ nome, telefone, email })
    // 201 = Created (diferente do 200, indica que algo foi criado)
    res.status(201).json(novoCliente)
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

export{
    criarCliente
}