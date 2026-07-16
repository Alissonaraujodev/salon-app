import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardCliente() {
  const { usuario, logout } = useAuth()

  return (
    <div>
      <h1>Olá, {usuario?.nome}!</h1>
      <p>Área do cliente</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}