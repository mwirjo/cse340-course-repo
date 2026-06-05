import bcrypt from 'bcrypt'
import { createUser, authenticateUser } from '../models/users.js'

export function showUserRegistrationForm(req, res) {
  res.render('register', { title: 'Register' })
}

export async function processUserRegistrationForm(req, res) {
  try {
    const { name, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    await createUser(name, email, passwordHash)
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).render('register', { title: 'Register', error: 'Registration failed. Email may already be in use.' })
  }
}

export function showLoginForm(req, res) {
  res.render('login', { title: 'Login' })
}

export async function processLoginForm(req, res) {
  const { email, password } = req.body
  const user = await authenticateUser(email, password)
  if (user) {
    req.session.user = user
    req.flash('success', 'Login successful!')
    console.log('Logged in user:', user)
    res.redirect('/dashboard')
  } else {
    req.flash('error', 'Invalid email or password.')
    res.redirect('/login')
  }
}

export function processLogout(req, res) {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err)
    res.redirect('/login')
  })
}

export function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to view that page.')
    return res.redirect('/login')
  }
  next()
}

export function showDashboard(req, res) {
  const { name, email } = req.session.user
  res.render('dashboard', { title: 'Dashboard', name, email })
}
export function requireRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role_name === role) {
      return next()
    }
    req.flash('error', 'You do not have permission to access that page.')
    res.redirect('/')
  }
}