import axios from 'axios'

// Cria uma instância do axios já configurada com a URL base da API
// Assim em todo lugar que chamar a API, não precisa repetir o endereço
const api = axios.create({
  baseURL: 'http://localhost:3001/api'
})

// Interceptor de requisição:
// Antes de cada chamada à API, pega o token salvo no localStorage
// e adiciona automaticamente no header Authorization
// Assim não precisa fazer isso manualmente em cada chamada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de resposta:
// Se qualquer chamada retornar 401 (token expirado ou inválido),
// limpa o localStorage e redireciona para o login automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api