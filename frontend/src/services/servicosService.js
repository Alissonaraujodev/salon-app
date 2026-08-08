import api from './api.js'

export async function listarServicos() {
  const response = await api.get('/servicos')
  return response.data
}

export async function criarServico(dados) {
  const response = await api.post('/servicos', dados)
  return response.data
}

export async function atualizarServico(id, dados) {
  const response = await api.put(`/servicos/${id}`, dados)
  return response.data
}