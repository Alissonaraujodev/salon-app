import pool from '../config/database.js'

async function listarClientes() {
  const [rows] = await pool.query(
    'SELECT * FROM clientes ORDER BY nome'
  )
  return rows
}

async function buscarClientePorId(id) {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE id = ?',
    [id]
  )
  return rows[0]
}

async function buscarClientePorEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE email = ?',
    [email]
  )
  return rows[0]
}

// Cria um novo cliente
async function criarCliente(dados) {
  const { nome, telefone, email } = dados

  const [result] = await pool.query(
    'INSERT INTO clientes (nome, telefone, email ) VALUES (?, ?, ?)',
    [nome, telefone, email ]
  )

  return buscarClientePorId(result.insertId)
}

async function atualizarCliente(id, dados) {
  const { nome, telefone, email } = dados

  await pool.query(
    'UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?',
    [nome, telefone, email, id]
  )

  return buscarClientePorId(id)
}

export {
  listarClientes,
  buscarClientePorId,
  buscarClientePorEmail,
  criarCliente,
  atualizarCliente
}