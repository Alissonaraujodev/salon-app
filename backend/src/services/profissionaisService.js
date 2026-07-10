import pool from '../config/database.js'

async function listarProfissionais() {
  const [rows] = await pool.query(
    'SELECT * FROM profissionais WHERE ativo = TRUE ORDER BY nome'
  )
  return rows
}

async function buscarProfissionalPorId(id) {
  const [rows] = await pool.query(
    'SELECT * FROM profissionais WHERE id = ?',
    [id]
  )
  return rows[0]
}

async function buscarProfissionalPorNome(nome) {
  const [rows] = await pool.query(
    `SELECT * 
    FROM profissionais 
    WHERE nome LIKE ?
    ORDER BY LOCATE(?, LOWER(nome)), nome`,
    [`%${nome}%`, nome.toLowerCase()]
  )

  return rows
}

async function buscarProfissionalPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM profissionais WHERE email = ?',
    [email]
  )
  return rows[0]
}

async function criarProfissional(dados) {
  const { nome, telefone, email, cargo, especialidade } = dados

  const [result] = await pool.query(
    'INSERT INTO profissionais (nome, telefone, email, cargo, especialidade ) VALUES (?, ?, ?, ?, ?)',
    [nome, telefone, email, cargo, especialidade ]
  )

  return buscarProfissionalPorId(result.insertId)
}

async function atualizarProfissional(id, dados) {
  const { nome, telefone, email, cargo, especialidade, ativo } = dados

  await pool.query(
    'UPDATE profissionais SET nome = ?, telefone = ?, email = ?, cargo = ?, especialidade = ?, ativo = ? WHERE id = ?',
    [nome, telefone, email, cargo, especialidade, ativo, id]
  )

  return buscarProfissionalPorId(id)
}

export {
  listarProfissionais,
  buscarProfissionalPorId,
  buscarProfissionalPorNome,
  buscarProfissionalPorEmail,
  criarProfissional,
  atualizarProfissional
}