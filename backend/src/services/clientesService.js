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

async function buscarClientePorTelefone(telefone){
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE telefone = ?', 
    [telefone]
  )
  return rows[0]
}

async function criarCliente(dados) {
  const { nome, telefone, data_nascimento, observacoes } = dados

  const [result] = await pool.query(
    'INSERT INTO clientes (nome, telefone, data_nascimento, observacoes) VALUES (?, ?, ?, ?)',
    [nome, telefone, data_nascimento, observacoes]
  )

  return buscarClientePorId(result.insertId)
}

async function atualizarCliente(id, dados) {
  const { nome, telefone, data_nascimento, observacoes } = dados

  await pool.query(
    'UPDATE clientes SET nome = ?, telefone = ?,data_nascimento = ?, observacoes = ? WHERE id = ?',
    [nome, telefone,data_nascimento, observacoes, id]
  )

  return buscarClientePorId(id)
}

export {
  listarClientes,
  buscarClientePorId,
  buscarClientePorTelefone,
  criarCliente,
  atualizarCliente
}