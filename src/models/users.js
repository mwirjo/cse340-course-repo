import pool from './db.js'
import bcrypt from 'bcrypt'

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT user_id, name, email, password_hash, role_id FROM users WHERE email = $1`,
    [email]
  )
  return result.rows.length === 0 ? null : result.rows[0]
}

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash)
}

export const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email)
  if (!user) return null
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null
  delete user.password_hash
  return user
}

export async function createUser(name, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, 1) RETURNING *`,
    [name, email, passwordHash]
  )
  return result.rows[0]
}