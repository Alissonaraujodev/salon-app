import bcrypt from 'bcryptjs'
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

  // Email não encontrado em nenhuma tabela
  return null
}

export { autenticarUsuario }