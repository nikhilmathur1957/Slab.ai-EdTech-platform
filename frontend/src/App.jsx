import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState('checking')
  const [apiData, setApiData] = useState(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [leads, setLeads] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website'
  })
  const [formStatus, setFormStatus] = useState('')

  const checkAPIHealth = async () => {
    try {
      const response = await fetch('/health')
      if (response.ok) {
        const data = await response.json()
        setHealthStatus('healthy')
        setApiData(data)
      }
    } catch (err) {
      setHealthStatus('error')
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      const result = await response.json()
      if (result.status === 'success') {
        setLeads(result.data.leads)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const result = await response.json()
      if (result.status === 'success') {
        setCourses(result.data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('sending')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        setFormStatus('success')
        setFormData({ name: '', email: '', phone: '', source: 'website' })
        setTimeout(() => {
          setFormStatus('')
          setShowLeadForm(false)
        }, 2000)
        fetchLeads() // Refresh leads list
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    checkAPIHealth()
    fetchCourses()
  }, [])

  useEffect(() => {
    if (showDashboard) {
      fetchLeads()
    }
  }, [showDashboard])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <h2>🚀 SLAB.AI</h2>
          <div className="nav-links">
            <button 
              className="nav-link"
              onClick={() => setShowDashboard(false)}
            >
              Home
            </button>
            <button 
              className="nav-link"
              onClick={() => setShowDashboard(true)}
            >
              Dashboard
            </button>
            <button 
              className="btn-primary nav-cta"
              onClick={() => setShowLeadForm(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
      {!showDashboard ? (
        /* Hero Section */
        <section className="hero">
          <div className="hero-content">
            <h1>Transform Leads into Learners</h1>
            <p className="hero-subtitle">AI-Powered Learning Platform</p>
            <p className="hero-description">
              Capture, nurture, and convert leads with our enterprise-ready platform. 
              Perfect for campaign spikes and result days.
            </p>
            
            <div className="cta-buttons">
              <button 
                className="btn-primary" 
                onClick={() => setShowLeadForm(true)}
              >
                Get Started Free
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowDashboard(true)}
              >
                View Dashboard
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Dashboard Section */
        <section className="dashboard">
          <div className="container">
            <h1>📊 Business Dashboard</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Leads</h3>
                <div className="stat-number">{leads.length}</div>
              </div>
              <div className="stat-card">
                <h3>Active Courses</h3>
                <div className="stat-number">{courses.length}</div>
              </div>
              <div className="stat-card">
                <h3>Conversion Rate</h3>
                <div className="stat-number">0%</div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Recent Leads</h2>
              <div className="leads-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone || 'N/A'}</td>
                        <td>{lead.source}</td>
                        <td>
                          <span className={`status-badge status-${lead.status}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length === 0 && (
                  <div className="empty-state">
                    No leads captured yet. <button onClick={() => setShowLeadForm(true)}>Capture your first lead</button>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Available Courses</h2>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span className="price">₹{course.price}</span>
                      <span className="duration">{course.duration} days</span>
                    </div>
                    <button className="btn-primary">Enroll Now</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Status Section - Only show on home */}
      {!showDashboard && (
        <section className="status-section">
          <div className="container">
            <h2>System Status</h2>
            <div className="status-grid">
              <div className="status-card">
                <h3>Backend API</h3>
                {healthStatus === 'healthy' && <div className="status-healthy">✅ Operational</div>}
                {healthStatus === 'error' && <div className="status-error">❌ Connection Issue</div>}
              </div>
              
              <div className="status-card">
                <h3>Lead System</h3>
                <div className="status-healthy">✅ Ready</div>
              </div>
              
              <div className="status-card">
                <h3>Payment System</h3>
                <div className="status-healthy">✅ Test Mode</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture Modal */}
      {showLeadForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Start Your Learning Journey</h3>
              <button 
                className="close-btn"
                onClick={() => setShowLeadForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="lead-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div className="form-group">
                <label>How did you hear about us?</label>
                <select 
                  name="source" 
                  value={formData.source} 
                  onChange={handleChange}
                >
                  <option value="website">Website</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="social_media">Social Media</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Sending...' : 'Get Started'}
              </button>
              
              {formStatus === 'success' && (
                <div className="success-message">
                  ✅ Thank you! We'll contact you shortly.
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="error-message">
                  ❌ Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
