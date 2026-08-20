# AI RESUME ANALYZER

An intelligent full-stack application that leverages Google Generative AI to help job seekers prepare for jobs by analyzing their resume against their job roles. Users can input their resume, job description, and self-description to receive tailored tips, and compatibility analysis.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Development](#development)

---

## ✨ Features

### Authentication & User Management
- User registration and secure login
- JWT-based authentication
- Password hashing with bcryptjs
- Token blacklisting for logout functionality
- Protected routes and API endpoints

### Interview Preparation
- **AI-Powered Report Generation**: Generates comprehensive interview analysis using Google Generative AI
- **Personalized Questions**: Tailored technical questions based on job description and candidate background
- **Match Scoring**: Compatibility score between candidate profile and job requirements
- **Interview Tips**: Strategic advice and preparation suggestions
- **Report Management**: View, save, and delete generated reports

### Dashboard
- View all generated reports
- Access detailed report information
- Track interview preparation progress

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Mongoose 9.3.3)
- **AI API**: Google Generative AI (@google/genai 1.50.1)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: bcryptjs 3.0.3, CORS, Cookie Parser
- **Development**: Nodemon

### Frontend
- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Routing**: React Router 7.13.2
- **Styling**: SASS 1.98.0
- **HTTP Client**: Axios 1.14.0
- **Linting**: ESLint 9.39.4

---

## 📁 Project Structure

```
ML/
├── Backend/                          # Node.js/Express backend
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   └── interview.controller.js # Interview report logic
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js   # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js        # User schema
│   │   │   ├── interviewReport.model.js # Report schema
│   │   │   └── blacklist.model.js   # Token blacklist schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Authentication routes
│   │   │   └── interview.routes.js  # Interview routes
│   │   └── services/
│   │       └── ai.service.js        # Google Generative AI integration
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── Frontend/                         # React/Vite frontend
│   ├── src/
│   │   ├── App.jsx                  # Root component
│   │   ├── app.routes.jsx           # Route configuration
│   │   ├── main.jsx                 # React entry point
│   │   ├── style.scss               # Global styles
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── features/
│   │   │   ├── ai/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   │   │   └── ReportDetail.jsx # Report details
│   │   │   │   └── services/
│   │   │   │       └── interview.api.js # API calls
│   │   │   └── auth/
│   │   │       ├── auth.context.jsx # Auth state management
│   │   │       ├── components/
│   │   │       │   └── Protected.jsx # Protected route wrapper
│   │   │       ├── hooks/
│   │   │       │   └── useAuth.js   # Auth custom hook
│   │   │       ├── pages/
│   │   │       │   ├── Login.jsx
│   │   │       │   └── Register.jsx
│   │   │       └── services/
│   │   │           └── auth.api.js  # Auth API calls
│   │   └── style/
│   │       ├── variables.scss       # SCSS variables
│   │       ├── layout.scss
│   │       ├── components.scss
│   │       └── button.scss
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── README.md                        # This file
```

---

## 📦 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or cloud instance)
- **Google Generative AI API Key** (get from [Google AI Studio](https://aistudio.google.com/))

---

## 🚀 Installation

### 1. Clone or Extract the Project
```bash
cd ML
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables
Create a `.env` file in the `Backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ml-interview
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ml-interview

# API Keys
GOOGLE_GENAI_API_KEY=your_google_generative_ai_api_key

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server Port (optional, defaults to 3000)
PORT=3000
```

### Frontend Configuration
The frontend is configured to connect to `http://localhost:3000` (Backend API).
- Update [Frontend/src/features/ai/services/interview.api.js](Frontend/src/features/ai/services/interview.api.js)
- Update [Frontend/src/features/auth/services/auth.api.js](Frontend/src/features/auth/services/auth.api.js)

If backend runs on a different port, update the API base URLs accordingly.

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server
```bash
cd Backend
npm run dev
```
Backend will run on `http://localhost:3000`

### Terminal 2: Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build (Frontend)
```bash
cd Frontend
npm run build
npm run preview
```

---

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |

### Interview Routes (`/api/interview`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/generate` | Generate interview report | Yes |
| GET | `/reports` | Get user's reports | Yes |
| GET | `/reports/:id` | Get specific report | Yes |
| DELETE | `/reports/:id` | Delete report | Yes |

### Request/Response Examples

**Generate Interview Report**
```bash
POST /api/interview/generate
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "jobDescription": "Senior React Developer with Node.js backend...",
  "resume": "John Doe\nExperience: 5 years in full-stack development...",
  "selfDescription": "Passionate about building scalable applications"
}
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Interview Report Model
```javascript
{
  userId: ObjectId (ref: User),
  jobDescription: String,
  resume: String,
  selfDescription: String,
  matchScore: Number (0-100),
  technicalQuestions: [{
    question: String,
    intention: String
  }],
  tips: [String],
  generatedAt: Date
}
```

### Token Blacklist Model
```javascript
{
  token: String (unique),
  expiresAt: Date
}
```

---

## 📖 Usage Guide

### 1. **Register**
   - Navigate to `/register`
   - Enter username and email
   - Create a secure password

### 2. **Login**
   - Navigate to `/login`
   - Use registered credentials
   - JWT token stored in cookies

### 3. **Generate Interview Report**
   - Go to Dashboard
   - Paste job description, resume, and self-description
   - Click "Generate Report"
   - AI analyzes and generates personalized interview questions and tips

### 4. **View Reports**
   - Access report history on Dashboard
   - Click report card for detailed analysis
   - View match score, technical questions, and preparation tips

### 5. **Logout**
   - Token is blacklisted for security
   - User session ends

---

## 👨‍💻 Development

### Code Style & Linting
```bash
# Frontend
cd Frontend
npm run lint
```

### Available Scripts

**Backend**
- `npm run dev` - Start development server with Nodemon

**Frontend**
- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: bcryptjs for secure password storage
- **Token Blacklisting**: Logout invalidates tokens
- **CORS Protection**: Restricted to frontend origin
- **Protected Routes**: API endpoints require authentication
- **Middleware Auth**: All sensitive endpoints protected

---

## 📝 Notes

- MongoDB connection required for full functionality
- Google Generative AI API key must be valid
- Frontend and backend CORS settings should match deployment URLs
- JWT_SECRET should be a strong, random string in production

---

## 🤝 Contributing

Feel free to submit issues or pull requests for improvements.

---

## 📄 License

ISC
