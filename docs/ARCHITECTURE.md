# 🏗️ SLAB.AI 2.0 - Architecture Overview

## System Architecture

### High-Level Design
\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │◄──►│   Node.js API    │◄──►│   MongoDB       │
│   (Frontend)    │    │   (Backend)      │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────┴─────┐           ┌─────┴─────┐           ┌─────┴─────┐
    │ CloudFront│           │   EKS     │           │ MongoDB  │
    │ + S3      │           │ (K8s)     │           │  Atlas   │
    └───────────┘           └───────────┘           └───────────┘
\`\`\`

## Component Details

### Frontend (Presentation Layer)
- **Technology**: React 18 + Vite
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: CSS3 with responsive design
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router (ready for implementation)

### Backend (Application Layer)
- **Technology**: Node.js + Express
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Monitoring**: Prometheus metrics
- **Logging**: Structured console logging

### Data Layer
- **Database**: MongoDB with Mongoose ODM
- **Development**: Local MongoDB in Docker
- **Production**: MongoDB Atlas (recommended)

## API Design

### RESTful Endpoints
\`\`\`
GET    /health                    # System health check
GET    /metrics                   # Prometheus metrics
POST   /api/leads                 # Create new lead
GET    /api/leads                 # List all leads
POST   /api/courses               # Create course
GET    /api/courses               # List courses
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/payments/create-intent # Create payment
\`\`\`

### Data Models

#### Lead Model
\`\`\`javascript
{
  id: Number,
  email: String,
  name: String,
  phone: String,
  source: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

#### Course Model
\`\`\`javascript
{
  id: Number,
  title: String,
  description: String,
  price: Number,
  duration: Number,
  category: String,
  isActive: Boolean
}
\`\`\`

## Infrastructure

### Local Development
- **Orchestration**: Docker Compose
- **Services**: Frontend, Backend, MongoDB
- **Networking**: Custom Docker network

### Production Ready
- **Kubernetes Manifests**: Complete K8s configuration
- **Health Checks**: Liveness and readiness probes
- **Resource Management**: CPU/Memory limits
- **Service Discovery**: Kubernetes services
- **Ingress**: Nginx ingress controller

## Security Considerations

### Application Security
- Input validation and sanitization
- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Security headers with Helmet

### Infrastructure Security
- Secrets management with Kubernetes Secrets
- Network policies (ready for implementation)
- TLS/SSL termination at ingress
- Private subnets for backend services

## Monitoring & Observability

### Health Monitoring
- HTTP health checks at \`/health\`
- Database connectivity checks
- Application metrics at \`/metrics\`

### Performance Metrics
- HTTP request duration histogram
- Memory usage tracking
- Custom business metrics

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design
- Multiple pod replicas
- Load balancing with Kubernetes services
- Readiness probes for smooth deployments

### Database Scaling
- MongoDB replica sets (production)
- Connection pooling
- Index optimization ready
