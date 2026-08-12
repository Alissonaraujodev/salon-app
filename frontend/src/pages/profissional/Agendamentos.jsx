import { useState, useEffect } from 'react'
import Layout from '../../components/Layout.jsx'
import Modal from '../../components/Modal.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { listarAgendamentos, criarAgendamento, atualizarStatus } from '../../services/agendamentosService.js'
import { listarClientes } from '../../services/clientesService.js'
import { listarProfissionais } from '../../services/profissionaisService.js'
import { listarServicos } from '../../services/servicosService.js'

const STATUS = {
  pendente:   { label: 'Pendente',   cor: 'bg-yellow-50 text-yellow-600' },
  confirmado: { label: 'Confirmado', cor: 'bg-blue-50 text-blue-600'    },
  concluido:  { label: 'Concluído',  cor: 'bg-green-50 text-green-600'  },
  cancelado:  { label: 'Cancelado',  cor: 'bg-red-50 text-red-400'      },
  faltou:     { label: 'Faltou',     cor: 'bg-gray-100 text-gray-400'   },
}

const FORM_VAZIO = {
  cliente_id: '',
  profissional_id: '',
  servico_id: '',
  data: '',
  hora: '',
  observacoes: ''
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [servicos, setServicos] = useState([])

  const [dataSelecionada, setDataSelecionada] = useState(
    // Inicializa com a data de hoje no formato YYYY-MM-DD
    new Date().toISOString().split('T')[0]
  )

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  const [atualizandoId, setAtualizandoId] = useState(null)

  useEffect(() => {
    carregarTudo()
  }, [])

  async function carregarTudo() {
    try {
      setCarregando(true)
      // Carrega tudo em paralelo — mais rápido que carregar um por um
      const [ag, cl, pr, sv] = await Promise.all([
        listarAgendamentos(),
        listarClientes(),
        listarProfissionais(),
        listarServicos()
      ])
      setAgendamentos(ag)
      setClientes(cl)
      setProfissionais(pr)
      setServicos(sv)
    } catch (error) {
      setErro('Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }

  // Filtra os agendamentos pela data selecionada
  const agendamentosDoDia = agendamentos.filter(ag => {
    const dataAg = new Date(ag.data_hora).toISOString().split('T')[0]
    return dataAg === dataSelecionada
  })

  // Ordena por horário
  const agendamentosOrdenados = [...agendamentosDoDia].sort(
    (a, b) => new Date(a.data_hora) - new Date(b.data_hora)
  )

  function abrirModal() {
    setForm({ ...FORM_VAZIO, data: dataSelecionada })
    setErroForm('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
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
      // Combina data e hora num único campo datetime para o backend
      const data_hora = `${form.data} ${form.hora}:00`

      const novo = await criarAgendamento({
        cliente_id: Number(form.cliente_id),
        profissional_id: Number(form.profissional_id),
        servico_id: Number(form.servico_id),
        data_hora,
        observacoes: form.observacoes || null
      })

      setAgendamentos(prev => [...prev, novo])
      fecharModal()
    } catch (error) {
      setErroForm(error.response?.data?.erro || 'Erro ao criar agendamento')
    } finally {
      setSalvando(false)
    }
  }

  async function handleAtualizarStatus(id, novoStatus) {
    setAtualizandoId(id)
    try {
      const atualizado = await atualizarStatus(id, novoStatus)
      setAgendamentos(prev =>
        prev.map(ag => ag.id === atualizado.id ? atualizado : ag)
      )
    } catch (error) {
      alert('Erro ao atualizar status')
    } finally {
      setAtualizandoId(null)
    }
  }

  function formatarHora(dataHora) {
    return new Date(dataHora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  }

  function formatarDataNavegacao(dataStr) {
    const [ano, mes, dia] = dataStr.split('-')
    const data = new Date(ano, mes - 1, dia)
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
  }

  function mudarDia(direcao) {
    const data = new Date(dataSelecionada)
    data.setDate(data.getDate() + direcao)
    setDataSelecionada(data.toISOString().split('T')[0])
  }

  function irParaHoje() {
    setDataSelecionada(new Date().toISOString().split('T')[0])
  }

  const hoje = new Date().toISOString().split('T')[0]
  const ehHoje = dataSelecionada === hoje

  return (
    <Layout titulo="Agendamentos">

      {/* Navegação de data */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => mudarDia(-1)}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50
                     text-gray-600 transition-colors"
        >
          ←
        </button>

        <div className="flex-1 text-center">
          <p className="font-medium text-gray-800 capitalize">
            {formatarDataNavegacao(dataSelecionada)}
          </p>
        </div>

        <button
          onClick={() => mudarDia(1)}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50
                     text-gray-600 transition-colors"
        >
          →
        </button>

        {!ehHoje && (
          <button
            onClick={irParaHoje}
            className="text-sm text-pink-500 hover:text-pink-700 font-medium
                       transition-colors px-3"
          >
            Hoje
          </button>
        )}

        <button
          onClick={abrirModal}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium
                     px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          + Novo
        </button>
      </div>

      {/* Input de data para seleção rápida */}
      <div className="mb-6">
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {carregando && (
        <p className="text-center text-gray-400 py-12">Carregando agendamentos...</p>
      )}

      {erro && !carregando && (
        <p className="text-center text-red-400 py-12">{erro}</p>
      )}

      {/* Lista vazia */}
      {!carregando && !erro && agendamentosOrdenados.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm">Nenhum agendamento para este dia</p>
          <button
            onClick={abrirModal}
            className="mt-4 text-pink-500 hover:text-pink-700 text-sm font-medium"
          >
            Criar agendamento
          </button>
        </div>
      )}

      {/* Cards de agendamentos */}
      {!carregando && agendamentosOrdenados.length > 0 && (
        <div className="flex flex-col gap-3">
          {agendamentosOrdenados.map(ag => (
            <div
              key={ag.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">

                {/* Horário */}
                <div className="text-center min-w-[52px]">
                  <p className="text-lg font-bold text-gray-800">
                    {formatarHora(ag.data_hora)}
                  </p>
                  <p className="text-xs text-gray-400">{ag.duracao_minutos} min</p>
                </div>

                {/* Divisor */}
                <div className="w-px bg-gray-100 self-stretch" />

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{ag.cliente_nome}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{ag.servico_nome}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    com {ag.profissional_nome}
                  </p>
                  {ag.observacoes && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      "{ag.observacoes}"
                    </p>
                  )}
                </div>

                {/* Preço e status */}
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-medium text-gray-800">
                    {Number(ag.preco).toLocaleString('pt-BR', {
                      style: 'currency', currency: 'BRL'
                    })}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full
                    ${STATUS[ag.status]?.cor || 'bg-gray-100 text-gray-400'}`}>
                    {STATUS[ag.status]?.label || ag.status}
                  </span>
                </div>
              </div>

              {/* Ações de status */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 flex-wrap">
                {Object.entries(STATUS)
                  .filter(([key]) => key !== ag.status)
                  .map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleAtualizarStatus(ag.id, key)}
                      disabled={atualizandoId === ag.id}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium
                        transition-colors disabled:opacity-50
                        ${val.cor} border-current hover:opacity-80`}
                    >
                      {atualizandoId === ag.id ? '...' : val.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de novo agendamento */}
      <Modal
        aberto={modalAberto}
        onFechar={fecharModal}
        titulo="Novo agendamento"
      >
        <div className="flex flex-col gap-4">

          {/* Select de cliente */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Cliente</label>
            <select
              name="cliente_id"
              value={form.cliente_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="">Selecione o cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Select de profissional */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Profissional</label>
            <select
              name="profissional_id"
              value={form.profissional_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="">Selecione o profissional...</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.cargo}
                </option>
              ))}
            </select>
          </div>

          {/* Select de serviço */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Serviço</label>
            <select
              name="servico_id"
              value={form.servico_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="">Selecione o serviço...</option>
              {servicos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome} — {s.duracao_minutos}min — {Number(s.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data"
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
            />
            <Input
              label="Hora"
              name="hora"
              type="time"
              value={form.hora}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              placeholder="Alguma observação para o profissional..."
              value={form.observacoes}
              onChange={handleChange}
              rows={2}
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
              Agendar
            </Button>
          </div>
        </div>
      </Modal>

    </Layout>
  )
}