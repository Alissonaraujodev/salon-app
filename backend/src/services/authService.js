import bcrypt from 'bcryptjs'
import { buscarClientePorEmailComSenha } from './clientesService.js'
import { buscarProfissionalPorEmailComSenha } from './profissionaisService.js'

async function autenticarUsuario(email, senha) {
  // Verifica primeiro em profissionais
  const profissional = await buscarProfissionalPorEmailComSenha(email)
  if (profissional) {
    const senhaCorreta = await bcrypt.compare(senha, profissional.senha)
    if (!senhaCorreta) return null

    return {
      id: profissional.id,
      nome: profissional.nome,
      email: profissional.email,
      cargo: profissional.cargo,
      tipo: 'profissional'
    }
  }

  // Se não achou em profissionais, verifica em clientes
  const cliente = await buscarClientePorEmailComSenha(email)
  if (cliente) {
    const senhaCorreta = await bcrypt.compare(senha, cliente.senha)
    if (!senhaCorreta) return null

    return {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      tipo: 'cliente'
    }
  }

  // Email não encontrado em nenhuma tabela
  return null
}

export { autenticarUsuario }