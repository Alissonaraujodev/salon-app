import * as agendamentosService from '../services/agendamentosService.js'
import * as clientesService from '../services/clientesService.js'
import * as profissionaisService from '../services/profissionaisService.js'
import * as servicosService from '../services/servicosService.js'

const STATUS_VALIDOS = ['pendente', 'confirmado', 'cancelado', 'concluido', 'faltou']

async function listarAgendamentos(req, res) {
  try {
    const agendamentos = await agendamentosService.listarAgendamentos()
    res.json(agendamentos)
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function buscarAgendamentoPorId(req, res) {
  try {
    const { id } = req.params
    const agendamento = await agendamentosService.buscarAgendamentoPorId(id)

    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' })
    }

    res.json(agendamento)
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function listarAgendamentosPorCliente(req, res) {
  try {
    const { clienteId } = req.params

    const cliente = await clientesService.buscarClientePorId(clienteId)
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' })
    }

    const agendamentos = await agendamentosService.listarAgendamentosPorCliente(clienteId)
    res.json(agendamentos)
  } catch (error) {
    console.error('Erro ao listar agendamentos do cliente:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function criarAgendamento(req, res) {
  try {
    const { cliente_id, profissional_id, servico_id, data_hora, observacoes } = req.body

    // Validação dos campos obrigatórios
    if (!cliente_id || !profissional_id || !servico_id || !data_hora) {
      return res.status(400).json({ 
        erro: 'cliente_id, profissional_id, servico_id e data_hora são obrigatórios' 
      })
    }

    // Valida se os registros relacionados existem
    const [cliente, profissional, servico] = await Promise.all([
      clientesService.buscarClientePorId(cliente_id),
      profissionaisService.buscarProfissionalPorId(profissional_id),
      servicosService.buscarServicoPorId(servico_id)
    ])

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' })
    }
    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado' })
    }
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' })
    }

    const novoAgendamento = await agendamentosService.criarAgendamento({
      cliente_id, profissional_id, servico_id, data_hora, observacoes
    })

    res.status(201).json(novoAgendamento)
  } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      if (error.message === 'Horário indisponível') {
        return res.status(409).json({
        erro: error.message
        })
      }
      res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ 
        erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` 
      })
    }

    const agendamento = await agendamentosService.buscarAgendamentoPorId(id)
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' })
    }

    const agendamentoAtualizado = await agendamentosService.atualizarStatus(id, status)
    res.json(agendamentoAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
}

export {
  listarAgendamentos,
  buscarAgendamentoPorId,
  listarAgendamentosPorCliente,
  criarAgendamento,
  atualizarStatus
}