import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardProfissional() {
  const { usuario, logout, ehAdmin } = useAuth()

  return (
    <div>
      <h1>Olá, {usuario?.nome}!</h1>
      <p>Cargo: {usuario?.cargo}</p>
      {ehAdmin() && <p>Você tem acesso de administrador</p>}
      <button onClick={logout}>Sair</button>
    </div>
  )
}