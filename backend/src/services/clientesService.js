import pool from '../config/database.js'

// Cria um novo cliente
async function criarCliente(dados) {
  const { nome, telefone, email } = dados

  const [result] = await pool.query(
    'INSERT INTO clientes (nome, telefone, email ) VALUES (?, ?, ?)',
    [nome, telefone, email ]
  )

  return {
    id: result.insertId,
    nome,
    telefone,
    email
  }
}

export {
    criarCliente
}