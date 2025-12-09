# MedBridge - Healthcare Application

## Quick Deployment (Vercel - Recommended)

The easiest way to deploy MedBridge is using Vercel:

1. **Backend Deployment**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project" → Import your GitHub repository
   - Set **Root Directory** to `backend`
   - Add all environment variables (see Environment Variables section below)
   - Deploy

2. **Frontend Deployment**
   - Create another project in Vercel
   - Set **Root Directory** to `frontend`
   - Add `REACT_APP_API_URL` environment variable with your backend URL
   - Deploy

3. **Update CORS**
   - Add `FRONTEND_URL` environment variable to backend with your frontend URL
   - Redeploy backend

📖 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Deployment Options

- **Vercel** (Recommended) - Easiest setup, automatic deployments
- **Render** - Good for backend services
- **GitHub Actions** - Automated CI/CD (workflows included)

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
- `REACT_APP_API_URL`: Backend API URL (e.g., `https://your-backend.vercel.app`)

### Backend
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: `development` or `production`
- `MONGODB_URI`: MongoDB Atlas connection string
- `FRONTEND_URL`: Frontend deployment URL (for CORS)
- `GEMINI_API_KEY`: Google Gemini API key
- `YOUTUBE_API_KEY`: YouTube API key
- `EMAILJS_PUBLIC_KEY`: EmailJS public key
- `EMAILJS_PRIVATE_KEY`: EmailJS private key
- `EMAILJS_SERVICE_ID`: EmailJS service ID
- `EMAILJS_TEMPLATE_ID`: EmailJS template ID
- `EMAILJS_REMINDER_TEMPLATE_ID`: EmailJS reminder template ID 