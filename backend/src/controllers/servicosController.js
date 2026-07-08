import * as servicosService from '../services/servicosService.js'

async function listarServicos(req, res) {
  try {
    const servicos = await servicosService.listarServicos()
    res.json(servicos)
  } catch (error) {
    console.error('Erro ao listar serviços:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function buscarServico(req, res) {
  try {
    // req.params contém os parâmetros da URL — em /api/servicos/3, o id é 3
    const { id } = req.params
    const servico = await servicosService.buscarServicoPorId(id)

    if (!servico) {
      // 404 = Not Found
      return res.status(404).json({ erro: 'Serviço não encontrado' })
    }

    res.json(servico)
  } catch (error) {
    console.error('Erro ao buscar serviço:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function criarServico(req, res) {
  try {
    // req.body contém o JSON enviado no corpo da requisição
    const { nome, descricao, duracao_minutos, preco } = req.body

    // Validação básica — campos obrigatórios
    if (!nome || !duracao_minutos || !preco) {
      // 400 = Bad Request (o cliente mandou dados inválidos)
      return res.status(400).json({ erro: 'Nome, duração e preço são obrigatórios' })
    }

    const novoServico = await servicosService.criarServico({ nome, descricao, duracao_minutos, preco })
    // 201 = Created (diferente do 200, indica que algo foi criado)
    res.status(201).json(novoServico)
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function atualizarServico(req, res) {
  try {
    const { id } = req.params
    const { nome, descricao, duracao_minutos, preco, ativo } = req.body

    if (!nome || !descricao || !duracao_minutos || !preco || ativo === undefined) {
      return res.status(400).json({ erro: 'Nome, descrição, duração em minutos, preço e status ativo ou não ativo são obrigatórios' })
    }

    const servicoExistente = await servicosService.buscarServicoPorId(id)
    if (!servicoExistente) {
      return res.status(404).json({ erro: 'Serviço não encontrado' })
    }

    const servicoAtualizado = await servicosService.atualizarServico(id, { nome, descricao, duracao_minutos, preco, ativo })
    res.json(servicoAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

export {
    listarServicos,
    buscarServico,
    criarServico, 
    atualizarServico
}