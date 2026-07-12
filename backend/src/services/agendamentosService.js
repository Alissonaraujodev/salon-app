import pool from '../config/database.js'
import * as servicosService from '../services/servicosService.js'

async function listarAgendamentos() {
  // JOIN para trazer os nomes junto com o agendamento
  // em vez de retornar só os IDs
  const [rows] = await pool.query(`
    SELECT 
      ag.id,
      ag.data_hora,
      ag.status,
      ag.observacoes,
      ag.criado_em,
      cl.id AS cliente_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      pr.id AS profissional_id,
      pr.nome AS profissional_nome,
      sv.id AS servico_id,
      sv.nome AS servico_nome,
      sv.duracao_minutos,
      sv.preco
    FROM agendamentos ag
    JOIN clientes cl ON ag.cliente_id = cl.id
    JOIN profissionais pr ON ag.profissional_id = pr.id
    JOIN servicos sv ON ag.servico_id = sv.id
    ORDER BY ag.data_hora DESC
  `)
  return rows
}

async function buscarAgendamentoPorId(id) {

  const [rows] = await pool.query(`
    SELECT 
      ag.id,
      ag.data_hora,
      ag.status,
      ag.observacoes,
      ag.criado_em,
      cl.id AS cliente_id,
      cl.nome AS cliente_nome,
      cl.telefone AS cliente_telefone,
      pr.id AS profissional_id,
      pr.nome AS profissional_nome,
      sv.id AS servico_id,
      sv.nome AS servico_nome,
      sv.duracao_minutos,
      sv.preco
    FROM agendamentos ag
    JOIN clientes cl ON ag.cliente_id = cl.id
    JOIN profissionais pr ON ag.profissional_id = pr.id
    JOIN servicos sv ON ag.servico_id = sv.id
    WHERE ag.id = ?
  `, [id])
  return rows[0]
}

async function listarAgendamentosPorCliente(clienteId) {
  const [rows] = await pool.query(`
    SELECT 
      ag.id,
      ag.data_hora,
      ag.status,
      ag.observacoes,
      pr.nome AS profissional_nome,
      sv.nome AS servico_nome,
      sv.preco
    FROM agendamentos ag
    JOIN profissionais pr ON ag.profissional_id = pr.id
    JOIN servicos sv ON ag.servico_id = sv.id
    WHERE ag.cliente_id = ?
    ORDER BY ag.data_hora DESC
  `, [clienteId])
  return rows
}

async function verificarHorario(profissionalId, inicio, fim) {
    const [rows] = await pool.query(
    `SELECT ag.id
     FROM agendamentos ag
     JOIN servicos s ON ag.servico_id = s.id
     WHERE ag.profissional_id = ?
      AND ag.data_hora < ?
      AND DATE_ADD(ag.data_hora, INTERVAL s.duracao_minutos MINUTE) > ?`,
    [profissionalId, fim, inicio]
  )

  return rows.length > 0
}

async function criarAgendamento(dados) {
  const { cliente_id, profissional_id, servico_id, data_hora, observacoes } = dados

   // Busca o serviço
  const servico = await servicosService.buscarServicoPorId(servico_id)

  // Calcula início
  const inicio = new Date(data_hora)

  // Calcula fim
  const fim = new Date(inicio)
  fim.setMinutes(fim.getMinutes() + servico.duracao_minutos)

  // Verifica conflito
  const ocupado = await verificarHorario(
    profissional_id,
    inicio,
    fim
  )

  if (ocupado) {
    throw new Error('Horário indisponível')
  }

  const [result] = await pool.query(
    `INSERT INTO agendamentos 
      (cliente_id, profissional_id, servico_id, data_hora, observacoes) 
     VALUES (?, ?, ?, ?, ?)`,
    [cliente_id, profissional_id, servico_id, data_hora, observacoes || null]
  )

  return buscarAgendamentoPorId(result.insertId)
}

async function atualizarStatus(id, status) {
  await pool.query(
    'UPDATE agendamentos SET status = ? WHERE id = ?',
    [status, id]
  )
  return buscarAgendamentoPorId(id)
}

export {
  listarAgendamentos,
  buscarAgendamentoPorId,
  listarAgendamentosPorCliente,
  criarAgendamento,
  atualizarStatus
}