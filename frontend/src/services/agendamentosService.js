import api from './api.js'

export async function listarAgendamentos() {
  const response = await api.get('/agendamentos')
  return response.data
}

export async function criarAgendamento(dados) {
  const response = await api.post('/agendamentos', dados)
  return response.data
}

export async function atualizarStatus(id, status) {
  const response = await api.patch(`/agendamentos/${id}/status`, { status })
  return response.data
}