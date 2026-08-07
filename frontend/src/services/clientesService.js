import api from './api.js'

export async function listarClientes() {
  const response = await api.get('/clientes')
  return response.data
}

export async function buscarClientePorId(id) {
  const response = await api.get(`/clientes/${id}`)
  return response.data
}

export async function criarCliente(dados) {
  const response = await api.post('/clientes', dados)
  return response.data
}

export async function atualizarCliente(id, dados) {
  const response = await api.put(`/clientes/${id}`, dados)
  return response.data
}