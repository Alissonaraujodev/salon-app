import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { login as loginService } from '../services/authService.js'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const dados = await loginService(email, senha)
      login(dados.usuario, dados.token)

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo / cabeçalho */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">💇‍♀️</div>
          <h1 className="text-2xl font-bold text-gray-800">Salão</h1>
          <p className="text-gray-500 text-sm mt-1">Faça login para continuar</p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-600 text-sm">{erro}</p>
              </div>
            )}

            <Button type="submit" carregando={carregando}>
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Ainda não tem conta?{' '}
          <a href="/cadastro" className="text-pink-500 hover:underline">
            Cadastre-se
          </a>
        </p>

      </div>
    </div>
  )
}