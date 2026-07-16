import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

import Login from '../pages/Login.jsx'
import DashboardCliente from '../pages/cliente/Dashboard.jsx'
import DashboardProfissional from '../pages/profissional/Dashboard.jsx'

// Componente que protege rotas — se não estiver logado, redireciona para login
function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return <div>Carregando...</div>
  if (!usuario) return <Navigate to="/login" replace />

  return children
}

// Componente que redireciona para o dashboard certo baseado no tipo do usuário
function RedirecionarDashboard() {
  const { usuario, ehCliente } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />
  if (ehCliente()) return <Navigate to="/cliente/dashboard" replace />
  return <Navigate to="/profissional/dashboard" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/cliente/dashboard" element={
          <RotaProtegida>
            <DashboardCliente />
          </RotaProtegida>
        } />

        <Route path="/profissional/dashboard" element={
          <RotaProtegida>
            <DashboardProfissional />
          </RotaProtegida>
        } />

        {/* Qualquer URL desconhecida redireciona para o dashboard certo */}
        <Route path="*" element={<RedirecionarDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}