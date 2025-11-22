import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import promClient from 'prom-client'

const app = express()
const PORT = process.env.PORT || 3001

// Import routes
import leadsRouter from './routes/leads.js'
import coursesRouter from './routes/courses.js'
import authRouter from './routes/auth.js'
import paymentsRouter from './routes/payments.js'

// Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics
collectDefaultMetrics({ timeout: 5000 })

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/leads', leadsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/auth', authRouter)
app.use('/api/payments', paymentsRouter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'SLAB.AI 2.0 Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'MongoDB Connected'
  })
})

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType)
  res.end(await promClient.register.metrics())
})

// Main API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'SLAB.AI 2.0 API is ready for business',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      leads: 'GET/POST /api/leads',
      courses: 'GET/POST /api/courses',
      auth: 'POST /api/auth/register, POST /api/auth/login',
      payments: 'POST /api/payments/create-intent, POST /api/payments/confirm'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SLAB.AI 2.0 Backend running on port ${PORT}`)
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`)
  console.log(`❤️  Health check at http://localhost:${PORT}/health`)
  console.log(`🎯 Lead API available at http://localhost:${PORT}/api/leads`)
  console.log(`📚 Courses API available at http://localhost:${PORT}/api/courses`)
  console.log(`🔐 Auth API available at http://localhost:${PORT}/api/auth`)
  console.log(`💳 Payments API available at http://localhost:${PORT}/api/payments`)
})
