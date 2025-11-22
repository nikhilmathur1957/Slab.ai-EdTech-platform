import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// In-memory store for development
let payments = []
let paymentIdCounter = 1

// Validation rules
const paymentValidationRules = [
  body('courseId').isInt({ min: 1 }),
  body('amount').isFloat({ min: 0 }),
  body('currency').optional().isIn(['usd', 'inr', 'eur'])
]

// Mock payment intent creation
router.post('/create-intent', paymentValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { courseId, amount, currency = 'inr' } = req.body

    // Mock payment intent (simulating Stripe)
    const mockPaymentIntentId = `pi_mock_${Date.now()}`
    const mockClientSecret = `cs_mock_${Date.now()}_secret`

    // Store payment record
    const paymentRecord = {
      id: paymentIdCounter++,
      courseId,
      amount,
      currency,
      paymentIntentId: mockPaymentIntentId,
      status: 'requires_payment_method',
      createdAt: new Date().toISOString()
    }

    payments.push(paymentRecord)

    console.log('💳 Mock payment intent created:', { 
      id: paymentRecord.id, 
      amount: paymentRecord.amount,
      paymentIntentId: mockPaymentIntentId 
    })

    res.json({
      status: 'success',
      message: 'Mock payment intent created (Test Mode)',
      data: {
        paymentIntentId: mockPaymentIntentId,
        clientSecret: mockClientSecret,
        amount: amount,
        currency: currency,
        testMode: true
      }
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment processing failed'
    })
  }
})

// Mock payment confirmation
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment intent ID is required'
      })
    }

    // Update local payment record to simulate success
    const paymentRecord = payments.find(p => p.paymentIntentId === paymentIntentId)
    if (paymentRecord) {
      paymentRecord.status = 'succeeded'
      paymentRecord.updatedAt = new Date().toISOString()
    }

    console.log('✅ Mock payment confirmed:', { 
      paymentIntentId, 
      status: 'succeeded' 
    })

    res.json({
      status: 'success',
      message: 'Mock payment confirmed (Test Mode)',
      data: {
        paymentIntentId: paymentIntentId,
        status: 'succeeded',
        testMode: true
      }
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment confirmation failed'
    })
  }
})

// Get payment history
router.get('/history', async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        payments: payments,
        total: payments.length
      }
    })
  } catch (error) {
    console.error('Error fetching payment history:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch payment history'
    })
  }
})

export default router
