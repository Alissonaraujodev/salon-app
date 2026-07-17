import Layout from '../../components/Layout.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardCliente() {
  const { usuario } = useAuth()

  return (
    <Layout titulo={`Olá, ${usuario?.nome?.split(' ')[0]}!`}>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-gray-500 text-sm">Bem-vindo à sua área!</p>
        <p className="text-gray-700 mt-2">
          Aqui você poderá ver e gerenciar seus agendamentos.
        </p>
      </div>
    </Layout>
  )
}