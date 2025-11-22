# 🛠️ SLAB.AI 2.0 - Development Guide

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development without Docker)

### Quick Start
\`\`\`bash
# Clone and setup
git clone <repository-url>
cd slab-ai-v2

# Start all services
docker-compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/health
\`\`\`

### Development Workflow

#### Backend Development
\`\`\`bash
cd backend

# Install dependencies
npm install

# Run with auto-reload (if using volumes)
npm run dev

# Test API endpoints
curl http://localhost:3001/health
\`\`\`

#### Frontend Development  
\`\`\`bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Access: http://localhost:3000
\`\`\`

### API Testing
\`\`\`bash
# Test lead capture
curl -X POST http://localhost:3001/api/leads \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "phone": "+919876543210",
    "source": "website"
  }'

# Test course creation
curl -X POST http://localhost:3001/api/courses \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "AI Fundamentals",
    "description": "Learn AI basics",
    "price": 2999,
    "duration": 30
  }'
\`\`\`

## Project Structure

### Backend Structure
\`\`\`
backend/
├── src/
│   ├── server.js          # Main server file
│   └── routes/            # API routes
│       ├── leads.js       # Lead management
│       ├── courses.js     # Course management
│       ├── auth.js        # Authentication
│       └── payments.js    # Payment processing
├── Dockerfile             # Development container
├── Dockerfile.prod        # Production container
└── package.json           # Dependencies
\`\`\`

### Frontend Structure
\`\`\`
frontend/
├── src/
│   ├── App.jsx            # Main application
│   ├── App.css            # Styles
│   └── main.jsx           # React entry point
├── Dockerfile             # Development container  
├── Dockerfile.prod        # Production container
├── nginx.conf             # Web server config
└── vite.config.js         # Build tool config
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=3001
DB_CONNECTION_STRING=mongodb://admin:password123@mongodb:27017/slab_ai?authSource=admin
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_example
\`\`\`

### Frontend (Vite)
\`\`\`env
VITE_API_BASE_URL=http://localhost:3001
\`\`\`

## Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend  
npm test
\`\`\`

## Deployment

### Local Kubernetes (Optional)
\`\`\`bash
# Apply Kubernetes manifests
kubectl apply -k infrastructure/kubernetes

# Check deployment
kubectl get pods,svc,ingress
\`\`\`

### Production Deployment
See \`PRODUCTION_DEPLOYMENT.md\` for AWS deployment instructions.
