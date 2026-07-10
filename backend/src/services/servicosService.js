import pool from '../config/database.js'

// Busca todos os serviços ativos no banco
async function listarServicos() {
  const [rows] = await pool.query(
    'SELECT * FROM servicos WHERE ativo = TRUE ORDER BY nome'
  )
  return rows
}

// Busca um serviço pelo ID
async function buscarServicoPorId(id) {
  const [rows] = await pool.query(
    'SELECT * FROM servicos WHERE id = ?',
    [id]
  )
  // rows é sempre um array, mesmo que venha só um resultado
  // por isso pegamos a posição [0]
  return rows[0]
}

async function buscarServicoPorNome(nome) {
  const [rows] = await pool.query(
    `SELECT * 
    FROM servicos 
    WHERE nome LIKE ?
    ORDER BY LOCATE(?, LOWER(nome)), nome`,
    [`%${nome}%`, nome.toLowerCase()]
  )

  return rows
}

// Cria um novo serviço
async function criarServico(dados) {
  const { nome, descricao, duracao_minutos, preco } = dados

  const [result] = await pool.query(
    'INSERT INTO servicos (nome, descricao, duracao_minutos, preco) VALUES (?, ?, ?, ?)',
    [nome, descricao, duracao_minutos, preco]
  )

  // result.insertId é o ID gerado automaticamente pelo AUTO_INCREMENT
  return buscarServicoPorId(result.insertId)
}

async function atualizarServico(id, dados) {
  const { nome, descricao, duracao_minutos, preco, ativo } = dados

  await pool.query(
    'UPDATE servicos SET nome = ?, descricao = ?, duracao_minutos = ?, preco = ?, ativo = ? WHERE id = ?',
    [nome, descricao, duracao_minutos, preco, ativo, id]
  )

  return buscarServicoPorId(id)
}

export {
    listarServicos,
    buscarServicoPorId,
    buscarServicoPorNome,
    criarServico,
    atualizarServico
}