import { useState, useEffect } from 'react'
import Layout from '../../components/Layout.jsx'
import Modal from '../../components/Modal.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import {
  listarProfissionais,
  criarProfissional,
  atualizarProfissional
} from '../../services/profissionaisService.js'

const FORM_VAZIO = {
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  cargo: '',
  especialidade: '',
  ativo: true
}

// Cargos disponíveis no salão
// Centralizado aqui para ser fácil de adicionar novos no futuro
const CARGOS = [
  'administrador',
  'cabeleireiro',
  'manicure',
  'esteticista',
  'recepcionista',
]

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [profissionalEditando, setProfissionalEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState([])
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarProfissionais()
  }, [])

  async function carregarProfissionais() {
    try {
      setCarregando(true)
      const dados = await listarProfissionais()
      setProfissionais(dados)
    } catch (error) {
      setErro('Erro ao carregar profissionais')
    } finally {
      setCarregando(false)
    }
  }

  const profissionaisFiltrados = profissionais.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.cargo?.toLowerCase().includes(busca.toLowerCase())
  )

  function abrirModalNovo() {
    setProfissionalEditando(null)
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(profissional) {
    setProfissionalEditando(profissional)
    setForm({
      nome: profissional.nome,
      telefone: profissional.telefone,
      email: profissional.email,
      senha: '', // senha nunca vem do banco — campo vazio na edição
      cargo: profissional.cargo,
      especialidade: profissional.especialidade || '',
      ativo: profissional.ativo === 1 || profissional.ativo === true
    })
    setErroForm('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setProfissionalEditando(null)
    setForm(FORM_VAZIO)
    setErroForm('')
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSalvar() {
    setErroForm('')
    setSalvando(true)

    try {
      if (profissionalEditando) {
        // Na edição, só envia a senha se o usuário digitou uma nova
        // Se deixou vazio, não manda o campo — o backend mantém a senha atual
        const payload = { ...form }
        if (!payload.senha) delete payload.senha

        const atualizado = await atualizarProfissional(profissionalEditando.id, payload)
        setProfissionais(prev =>
          prev.map(p => p.id === atualizado.id ? atualizado : p)
        )
      } else {
        const novo = await criarProfissional(form)
        setProfissionais(prev => [...prev, novo])
      }
      fecharModal()
    } catch (error) {
      setErroForm(error.response?.data?.erro || 'Erro ao salvar profissional')
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

  return (
    <Layout titulo="Profissionais">

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou cargo..."
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
          + Novo profissional
        </button>
      </div>

      {carregando && (
        <p className="text-center text-gray-400 py-12">Carregando profissionais...</p>
      )}

      {erro && !carregando && (
        <p className="text-center text-red-400 py-12">{erro}</p>
      )}

      {!carregando && !erro && profissionaisFiltrados.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👩‍💼</p>
          <p className="text-sm">
            {busca ? 'Nenhum profissional encontrado' : 'Nenhum profissional cadastrado ainda'}
          </p>
        </div>
      )}

      {!carregando && profissionaisFiltrados.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nome</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden md:table-cell">Cargo</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden md:table-cell">Telefone</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden lg:table-cell">Especialidade</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {profissionaisFiltrados.map((profissional, index) => (
                <tr
                  key={profissional.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors
                    ${index === profissionaisFiltrados.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{profissional.nome}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{profissional.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell capitalize">
                    {profissional.cargo}
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    {formatarTelefone(profissional.telefone)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">
                    {profissional.especialidade || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full
                      ${profissional.ativo
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                      {profissional.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => abrirModalEdicao(profissional)}
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

      <Modal
        aberto={modalAberto}
        onFechar={fecharModal}
        titulo={profissionalEditando ? 'Editar profissional' : 'Novo profissional'}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            name="nome"
            placeholder="Julia Costa"
            value={form.nome}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Telefone"
              name="telefone"
              placeholder="(11) 99999-0001"
              value={form.telefone}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="julia@salao.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <Input
            label={profissionalEditando ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
            name="senha"
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Select de cargo — mais seguro que input livre */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Cargo</label>
              <select
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">Selecione...</option>
                {CARGOS.map(cargo => (
                  <option key={cargo} value={cargo} className="capitalize">
                    {cargo.charAt(0).toUpperCase() + cargo.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Especialidade"
              name="especialidade"
              placeholder="Coloração, Corte..."
              value={form.especialidade}
              onChange={handleChange}
            />
          </div>

          {/* Checkbox de ativo — só na edição */}
          {profissionalEditando && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ativo"
                checked={form.ativo}
                onChange={handleChange}
                className="w-4 h-4 accent-pink-500"
              />
              <span className="text-sm text-gray-700">Profissional ativo</span>
            </label>
          )}

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
              {profissionalEditando ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>

    </Layout>
  )
}