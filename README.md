# MedBridge - Healthcare Application

## Deployment Instructions

### Frontend Deployment
You can deploy the frontend to any static hosting service of your choice (Netlify, GitHub Pages, etc.)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The build folder will contain the static files ready for deployment

### Backend Deployment (Render)

1. Create a Render account at https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the deployment:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables (copy from .env):
     - PORT
     - NODE_ENV=production
     - MONGODB_URI (use MongoDB Atlas URL)
     - GEMINI_API_KEY
     - YOUTUBE_API_KEY
     - EMAILJS_PUBLIC_KEY
     - EMAILJS_PRIVATE_KEY
     - EMAILJS_SERVICE_ID
     - EMAILJS_TEMPLATE_ID
     - EMAILJS_REMINDER_TEMPLATE_ID

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update MONGODB_URI in your backend environment variables

### Final Steps

1. Update backend CORS configuration in `backend/index.js` with your frontend domain
2. Update backend API URL in frontend environment variables
3. Deploy both frontend and backend
4. Test the application

## Local Development

1. Clone the repository
2. Install dependencies:
```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Create `.env` files:
   - Copy `.env.example` to `.env` in both frontend and backend
   - Fill in your environment variables

4. Start the development servers:
```bash
# Terminal 1 - Frontend
cd frontend && npm start

# Terminal 2 - Backend
cd backend && npm start
```

## Environment Variables

### Frontend
- REACT_APP_API_URL: Backend API URL

### Backend
- PORT: Server port (default: 5000)
- NODE_ENV: development/production
- MONGODB_URI: MongoDB connection string
- GEMINI_API_KEY: Google Gemini API key
- YOUTUBE_API_KEY: YouTube API key
- EMAILJS_PUBLIC_KEY: EmailJS public key
- EMAILJS_PRIVATE_KEY: EmailJS private key
- EMAILJS_SERVICE_ID: EmailJS service ID
- EMAILJS_TEMPLATE_ID: EmailJS template ID
- EMAILJS_REMINDER_TEMPLATE_ID: EmailJS reminder template ID 