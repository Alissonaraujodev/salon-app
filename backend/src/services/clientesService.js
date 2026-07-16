import pool from '../config/database.js'
import bcrypt from 'bcryptjs'

async function listarClientes() {
  const [rows] = await pool.query(
    `SELECT 
      id,
      nome,
      telefone,
      email,
      criado_em,
      atualizado_em 
    FROM clientes 
    ORDER BY nome`
  )
  return rows
}

async function buscarClientePorId(id) {
  const [rows] = await pool.query(
    `SELECT 
      id,
      nome,
      telefone,
      email,
      criado_em,
      atualizado_em     
    FROM clientes 
    WHERE id = ?`,
    [id]
  )
  return rows[0]
}

async function buscarClientePorEmailComSenha(email) {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE email = ?',
    [email]
  )
  return rows[0]
}

async function buscarClientePorEmail(email) {
  const [rows] = await pool.query(
    `SELECT 
      id,
      nome,
      telefone,
      email    
    FROM clientes 
    WHERE email = ?`,
    [email]
  )
  return rows[0]
}

async function criarCliente(dados) {
  const { nome, telefone, email, senha } = dados

  // Criptografa a senha antes de salvar
  const senhaHash = await bcrypt.hash(senha, 10)

  const [result] = await pool.query(
    'INSERT INTO clientes (nome, telefone, email, senha ) VALUES (?, ?, ?, ?)',
    [nome, telefone, email, senhaHash ]
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
  buscarClientePorEmailComSenha,
  buscarClientePorEmail,
  criarCliente,
  atualizarCliente
}