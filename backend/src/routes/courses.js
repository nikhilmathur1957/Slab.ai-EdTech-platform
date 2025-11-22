import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// In-memory store for development
let courses = []
let courseIdCounter = 1

// Validation rules
const courseValidationRules = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 1 }),
  body('category').optional().trim().escape()
]

// Create new course
router.post('/', courseValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { title, description, price, duration, category, imageUrl } = req.body

    const newCourse = {
      id: courseIdCounter++,
      title,
      description,
      price: parseFloat(price),
      duration: duration || null,
      category: category || 'general',
      imageUrl: imageUrl || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    courses.push(newCourse)
    console.log('📚 New course created:', { id: newCourse.id, title: newCourse.title })

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: newCourse
    })
  } catch (error) {
    console.error('Error creating course:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, active } = req.query
    
    let filteredCourses = courses
    
    if (category) {
      filteredCourses = courses.filter(course => course.category === category)
    }
    
    if (active === 'true') {
      filteredCourses = filteredCourses.filter(course => course.isActive)
    }

    res.json({
      status: 'success',
      data: {
        courses: filteredCourses,
        total: filteredCourses.length
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      })
    }
    
    res.json({
      status: 'success',
      data: course
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
})

export default router
