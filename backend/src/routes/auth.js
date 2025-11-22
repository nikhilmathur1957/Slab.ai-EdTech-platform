import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// In-memory store for development
let users = []
let userIdCounter = 1

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret'

// Validation rules
const registerValidationRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 }).escape(),
  body('phone').optional().isMobilePhone()
]

const loginValidationRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
]

// User registration
router.post('/register', registerValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password, name, phone } = req.body
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User already exists with this email'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = {
      id: userIdCounter++,
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('👤 New user registered:', { id: newUser.id, email: newUser.email })

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token
      }
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

// User login
router.post('/login', loginValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body
    
    // Find user
    const user = users.find(u => u.email === email && u.isActive)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('🔐 User logged in:', { id: user.id, email: user.email })

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

export default router
