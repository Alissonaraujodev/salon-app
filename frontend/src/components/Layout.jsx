import { useAuth } from '../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

export default function Layout({ children, titulo }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💇‍♀️</span>
            <span className="font-bold text-gray-800">Salão</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{usuario?.nome}</p>
              <p className="text-xs text-gray-400 capitalize">{usuario?.cargo || usuario?.tipo}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {titulo && (
          <h1 className="text-xl font-bold text-gray-800 mb-6">{titulo}</h1>
        )}
        {children}
      </main>

    </div>
  )
}