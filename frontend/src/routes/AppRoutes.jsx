import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Login from '../pages/Login.jsx'
import Dashboard from '../pages/profissional/Dashboard.jsx'
import Clientes from '../pages/profissional/Clientes.jsx'
import Servicos from '../pages/profissional/Servicos.jsx'
import Profissionais from '../pages/profissional/Profissionais.jsx'


// Componente que protege rotas — se não estiver logado, redireciona para login
function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return <div>Carregando...</div>
  if (!usuario) return <Navigate to="/login" replace />

  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <RotaProtegida><Dashboard/></RotaProtegida>
        } />

        <Route path="/agendamentos" element={
          <RotaProtegida><div>Agendamentos (em breve)</div></RotaProtegida>
        } />

        <Route path="/clientes" element={
          <RotaProtegida><Clientes /></RotaProtegida>
        } />

        <Route path="/servicos" element={
          <RotaProtegida><Servicos /></RotaProtegida>
        } />

        <Route path="/profissionais" element={
          <RotaProtegida><Profissionais /></RotaProtegida>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}