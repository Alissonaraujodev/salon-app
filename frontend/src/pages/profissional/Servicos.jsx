import { useState, useEffect } from 'react'
import Layout from '../../components/Layout.jsx'
import Modal from '../../components/Modal.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import {
  listarServicos,
  criarServico,
  atualizarServico
} from '../../services/servicosService.js'

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  duracao_minutos: '',
  preco: '',
  ativo: true
}

export default function Servicos() {
  const [servicos, setServicos] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [servicoEditando, setServicoEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarServicos()
  }, [])

  async function carregarServicos() {
    try {
      setCarregando(true)
      const dados = await listarServicos()
      setServicos(dados)
    } catch (error) {
      setErro('Erro ao carregar serviços')
    } finally {
      setCarregando(false)
    }
  }

  const servicosFiltrados = servicos.filter(s =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  )

  function abrirModalNovo() {
    setServicoEditando(null)
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(servico) {
    setServicoEditando(servico)
    setForm({
      nome: servico.nome,
      descricao: servico.descricao || '',
      duracao_minutos: String(servico.duracao_minutos),
      preco: String(servico.preco),
      ativo: servico.ativo === 1 || servico.ativo === true
    })
    setErroForm('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setServicoEditando(null)
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
      const payload = {
        ...form,
        duracao_minutos: Number(form.duracao_minutos),
        preco: Number(form.preco)
      }

      if (servicoEditando) {
        const atualizado = await atualizarServico(servicoEditando.id, payload)
        setServicos(prev =>
          prev.map(s => s.id === atualizado.id ? atualizado : s)
        )
      } else {
        const novo = await criarServico(payload)
        setServicos(prev => [...prev, novo])
      }
      fecharModal()
    } catch (error) {
      setErroForm(error.response?.data?.erro || 'Erro ao salvar serviço')
    } finally {
      setSalvando(false)
    }
  }

  function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function formatarDuracao(minutos) {
    if (minutos < 60) return `${minutos} min`
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }

  return (
    <Layout titulo="Serviços">

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar serviço..."
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
          + Novo serviço
        </button>
      </div>

      {carregando && (
        <p className="text-center text-gray-400 py-12">Carregando serviços...</p>
      )}

      {erro && !carregando && (
        <p className="text-center text-red-400 py-12">{erro}</p>
      )}

      {!carregando && !erro && servicosFiltrados.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✂️</p>
          <p className="text-sm">
            {busca ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado ainda'}
          </p>
        </div>
      )}

      {!carregando && servicosFiltrados.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nome</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden md:table-cell">Duração</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Preço</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium hidden lg:table-cell">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {servicosFiltrados.map((servico, index) => (
                <tr
                  key={servico.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors
                    ${index === servicosFiltrados.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{servico.nome}</p>
                    {servico.descricao && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">
                        {servico.descricao}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    {formatarDuracao(servico.duracao_minutos)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatarPreco(servico.preco)}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full
                      ${servico.ativo
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => abrirModalEdicao(servico)}
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
        titulo={servicoEditando ? 'Editar serviço' : 'Novo serviço'}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nome do serviço"
            name="nome"
            placeholder="Corte feminino"
            value={form.nome}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              name="descricao"
              placeholder="Descrição do serviço..."
              value={form.descricao}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duração (minutos)"
              name="duracao_minutos"
              type="number"
              placeholder="60"
              min="1"
              value={form.duracao_minutos}
              onChange={handleChange}
            />
            <Input
              label="Preço (R$)"
              name="preco"
              type="number"
              placeholder="80.00"
              min="0"
              step="0.01"
              value={form.preco}
              onChange={handleChange}
            />
          </div>

          {/* Checkbox de ativo — só aparece na edição */}
          {servicoEditando && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ativo"
                checked={form.ativo}
                onChange={handleChange}
                className="w-4 h-4 accent-pink-500"
              />
              <span className="text-sm text-gray-700">Serviço ativo</span>
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
              {servicoEditando ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>

    </Layout>
  )
}