import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

// Hook personalizado que simplifica o acesso ao contexto
// Em vez de importar useContext e AuthContext em todo componente,
// você só importa useAuth e já tem tudo
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro do AuthProvider')
  }

  return context
}