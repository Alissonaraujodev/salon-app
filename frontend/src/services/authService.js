import api from './api.js'

export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha })
  return response.data
  // Retorna { token, usuario: { id, nome, email, tipo, cargo } }
}