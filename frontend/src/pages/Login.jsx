import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { login as loginService } from '../services/authService.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login, ehCliente } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const dados = await loginService(email, senha)
      login(dados.usuario, dados.token)

      // Redireciona baseado no tipo do usuário
      if (dados.usuario.tipo === 'cliente') {
        navigate('/cliente/dashboard')
      } else {
        navigate('/profissional/dashboard')
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p>{erro}</p>}
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}