import api from './api.js'

export async function listarProfissionais() {
  const response = await api.get('/profissionais')
  return response.data
}

export async function criarProfissional(dados) {
  const response = await api.post('/profissionais', dados)
  return response.data
}

export async function atualizarProfissional(id, dados) {
  const response = await api.put(`/profissionais/${id}`, dados)
  return response.data
}