import { useAuth } from '../../hooks/useAuth.js'
import Layout from '../../components/Layout.jsx'

export default function Dashboard() {
  const { usuario, ehAdmin } = useAuth()
  const primeiroNome = usuario?.nome?.split(' ')[0]

  return (
    <Layout titulo={`Olá, ${primeiroNome}!`}>

      {/* Cards de navegação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <CardMenu
          emoji="📅"
          titulo="Agendamentos"
          descricao="Ver e gerenciar agendamentos do dia"
          href="/agendamentos"
          cor="pink"
        />

        <CardMenu
          emoji="👥"
          titulo="Clientes"
          descricao="Cadastrar e buscar clientes"
          href="/clientes"
          cor="purple"
        />

        {ehAdmin() && (
          <>
            <CardMenu
              emoji="✂️"
              titulo="Serviços"
              descricao="Gerenciar serviços oferecidos"
              href="/servicos"
              cor="blue"
            />
            <CardMenu
              emoji="👩‍💼"
              titulo="Profissionais"
              descricao="Gerenciar equipe do salão"
              href="/profissionais"
              cor="green"
            />
          </>
        )}

      </div>
    </Layout>
  )
}

function CardMenu({ emoji, titulo, descricao, href, cor }) {
  const cores = {
    pink:   'border-pink-100 hover:border-pink-300 hover:bg-pink-50',
    purple: 'border-purple-100 hover:border-purple-300 hover:bg-purple-50',
    blue:   'border-blue-100 hover:border-blue-300 hover:bg-blue-50',
    green:  'border-green-100 hover:border-green-300 hover:bg-green-50',
  }

  return (
    <a
      href={href}
      className={`
        block bg-white rounded-2xl border-2 p-6
        transition-all duration-200 cursor-pointer
        shadow-sm hover:shadow-md
        ${cores[cor]}
      `}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h2 className="font-semibold text-gray-800 mb-1">{titulo}</h2>
      <p className="text-sm text-gray-400">{descricao}</p>
    </a>
  )
}