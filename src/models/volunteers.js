import pool from './db.js'

export async function addVolunteer(userId, projectId) {
  await pool.query(
    `INSERT INTO volunteers (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, projectId]
  )
}

export async function removeVolunteer(userId, projectId) {
  await pool.query(
    `DELETE FROM volunteers WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
}

export async function getVolunteerProjectsByUser(userId) {
  const result = await pool.query(
    `SELECT sp.project_id, sp.title, sp.date, sp.location
     FROM volunteers v
     JOIN service_projects sp ON v.project_id = sp.project_id
     WHERE v.user_id = $1
     ORDER BY sp.date`,
    [userId]
  )
  return result.rows
}

export async function isUserVolunteered(userId, projectId) {
  const result = await pool.query(
    `SELECT 1 FROM volunteers WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
  return result.rows.length > 0
}