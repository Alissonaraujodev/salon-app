import { createContext, useState, useEffect } from 'react'

// O contexto é um "canal" que permite compartilhar dados
// entre componentes sem precisar passar props manualmente
// por cada nível da árvore de componentes
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Quando o app abre, verifica se já tem usuário salvo no localStorage
  // Isso mantém o usuário logado mesmo após recarregar a página
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    const tokenSalvo = localStorage.getItem('token')

    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo))
    }

    setCarregando(false)
  }, [])

  function login(dadosUsuario, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  // Helpers para verificar permissões em qualquer componente
  function ehAdmin() {
    return usuario?.tipo === 'profissional' && usuario?.cargo === 'administrador'
  }

  function ehProfissional() {
    return usuario?.tipo === 'profissional'
  }

  function ehCliente() {
    return usuario?.tipo === 'cliente'
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando, ehAdmin, ehProfissional, ehCliente }}>
      {children}
    </AuthContext.Provider>
  )
}