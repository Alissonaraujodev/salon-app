import Layout from '../../components/Layout.jsx'
import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardProfissional() {
  const { usuario, ehAdmin } = useAuth()

  return (
    <Layout titulo={`Olá, ${usuario?.nome?.split(' ')[0]}!`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-gray-500">Cargo</p>
          <p className="text-lg font-semibold text-gray-800 capitalize mt-1">
            {usuario?.cargo}
          </p>
        </div>

        {ehAdmin() && (
          <div className="bg-pink-50 rounded-2xl border border-pink-100 p-6 shadow-sm">
            <p className="text-sm text-pink-500">Acesso</p>
            <p className="text-lg font-semibold text-pink-700 mt-1">
              Administrador
            </p>
          </div>
        )}

      </div>
    </Layout>
  )
}