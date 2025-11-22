import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// In-memory store for development
let leads = []
let leadIdCounter = 1

// Validation rules
const leadValidationRules = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 1 }).escape(),
  body('phone').optional().isMobilePhone(),
  body('source').optional().trim().escape(),
  body('campaign').optional().trim().escape()
]

// Create new lead
router.post('/', leadValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, name, phone, source, campaign } = req.body
    
    // Check for duplicate
    const existingLead = leads.find(lead => lead.email === email)
    if (existingLead) {
      return res.status(409).json({
        status: 'error',
        message: 'Lead already exists'
      })
    }

    const newLead = {
      id: leadIdCounter++,
      email,
      name,
      phone: phone || null,
      source: source || 'direct',
      campaign: campaign || null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    leads.push(newLead)
    console.log('🎯 New lead captured:', { id: newLead.id, email: newLead.email })

    res.status(201).json({
      status: 'success',
      message: 'Lead created successfully',
      data: newLead
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

// Get all leads
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    let filteredLeads = leads
    if (status) {
      filteredLeads = leads.filter(lead => lead.status === status)
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex)
    
    res.json({
      status: 'success',
      data: {
        leads: paginatedLeads,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredLeads.length / limit),
          totalLeads: filteredLeads.length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

export default router
