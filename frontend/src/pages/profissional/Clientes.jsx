import { useState, useEffect } from 'react'
import Layout from '../../components/Layout.jsx'
import Modal from '../../components/Modal.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import {
  listarClientes,
  criarCliente,
  atualizarCliente
} from '../../services/clientesService.js'

const FORM_VAZIO = {
  nome: '',
  telefone: '',
  data_nascimento: '',
  observacoes: ''
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Controle do modal
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Carrega os clientes ao abrir a página
  useEffect(() => {
    carregarClientes()
  }, [])

  async function carregarClientes() {
    try {
      setCarregando(true)
      const dados = await listarClientes()
      setClientes(dados)
    } catch (error) {
      setErro('Erro ao carregar clientes')
    } finally {
      setCarregando(false)
    }
  }

  // Filtra localmente pelo nome ou telefone digitado na busca
  // Não faz uma nova chamada à API a cada letra — filtra os dados já carregados
  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  )

  function abrirModalNovo() {
    setClienteEditando(null)
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(cliente) {
    setClienteEditando(cliente)
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone,
      data_nascimento: cliente.data_nascimento
        ? cliente.data_nascimento.split('T')[0] // formata para o input date
        : '',
      observacoes: cliente.observacoes || ''
    })
    setErroForm('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setClienteEditando(null)
    setForm(FORM_VAZIO)
    setErroForm('')
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSalvar() {
    setErroForm('')
    setSalvando(true)

    try {
      if (clienteEditando) {
        const atualizado = await atualizarCliente(clienteEditando.id, form)
        // Atualiza o cliente na lista local sem precisar recarregar tudo
        setClientes(prev =>
          prev.map(c => c.id === atualizado.id ? atualizado : c)
        )
      } else {
        const novo = await criarCliente(form)
        setClientes(prev => [...prev, novo])
      }
      fecharModal()
    } catch (error) {
      setErroForm(error.response?.data?.erro || 'Erro ao salvar cliente')
    } finally {
      setSalvando(false)
    }
  }

  function formatarTelefone(telefone) {
    const t = telefone.replace(/\D/g, '')
    if (t.length === 11) return `(${t.slice(0,2)}) ${t.slice(2,7)}-${t.slice(7)}`
    if (t.length === 10) return `(${t.slice(0,2)}) ${t.slice(2,6)}-${t.slice(6)}`
    return telefone
  }

  function formatarData(data) {
    if (!data) return '—'
    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  return (
    <Layout titulo="Clientes">

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={abrirModalNovo}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium
                     px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          + Novo cliente
        </button>
      </div>

      {/* Estado de carregamento */}
      {carregando && (
        <p className="text-center text-gray-400 py-12">Carregando clientes...</p>
      )}

      {/* Erro de carregamento */}
      {erro && !carregando && (
        <p className="text-center text-red-400 py-12">{erro}</p>
      )}

      {/* Lista vazia */}
      {!carregando && !erro && clientesFiltrados.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-sm">
            {busca ? 'Nenhum cliente encontrado para essa busca' : 'Nenhum cliente cadastrado ainda'}
          </p>
        </div>
      )}

      {/* Tabela de clientes */}
      {!carregando && clientesFiltrados.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nome</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Telefone</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden md:table-cell">Nascimento</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden lg:table-cell">Observações</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors
                    ${index === clientesFiltrados.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{cliente.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{formatarTelefone(cliente.telefone)}</td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    {formatarData(cliente.data_nascimento)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden lg:table-cell max-w-xs truncate">
                    {cliente.observacoes || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => abrirModalEdicao(cliente)}
                      className="text-pink-500 hover:text-pink-700 font-medium transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de cadastro/edição */}
      <Modal
        aberto={modalAberto}
        onFechar={fecharModal}
        titulo={clienteEditando ? 'Editar cliente' : 'Novo cliente'}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            name="nome"
            placeholder="Ana Silva"
            value={form.nome}
            onChange={handleChange}
          />
          <Input
            label="Telefone"
            name="telefone"
            placeholder="(11) 99999-0001"
            value={form.telefone}
            onChange={handleChange}
          />
          <Input
            label="Data de nascimento"
            name="data_nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              placeholder="Alergias, preferências, etc."
              value={form.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </div>

          {erroForm && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm">{erroForm}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variante="secundario" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} carregando={salvando}>
              {clienteEditando ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>

    </Layout>
  )
}