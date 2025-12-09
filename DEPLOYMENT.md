# MedBridge Deployment Guide

This guide will help you deploy both the frontend and backend of the MedBridge application.

## Prerequisites

1. **GitHub Account** - Your code is already on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **MongoDB Atlas Account** - For database (free tier available)
4. **API Keys**:
   - Google Gemini API Key
   - YouTube API Key
   - EmailJS credentials

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended - Easiest)

#### Backend Deployment

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"

2. **Import GitHub Repository**
   - Select your `MedBridge` repository
   - Choose the `main` branch

3. **Configure Backend Project**
   - **Root Directory**: Select `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add the following in Vercel dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_PRIVATE_KEY=your_emailjs_private_key
   EMAILJS_SERVICE_ID=your_emailjs_service_id
   EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   EMAILJS_REMINDER_TEMPLATE_ID=your_emailjs_reminder_template_id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://medbridge-backend.vercel.app`)

#### Frontend Deployment

1. **Create New Project in Vercel**
   - Click "Add New Project" again
   - Select the same `MedBridge` repository

2. **Configure Frontend Project**
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add the following:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```
   Replace `your-backend-url.vercel.app` with your actual backend URL from step 5 above.

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://medbridge-frontend.vercel.app`)

5. **Update Backend CORS**
   - Go back to your backend project in Vercel
   - Add/Update environment variable:
     ```
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Update `backend/index.js` CORS configuration to use this environment variable
   - Redeploy backend

### Option 2: Deploy via GitHub Actions (Automated)

#### Setup GitHub Secrets

1. **Get Vercel Tokens**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel login`
   - Run: `vercel link` in both `backend` and `frontend` directories
   - Get your tokens from [vercel.com/account/tokens](https://vercel.com/account/tokens)

2. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID (found in `.vercel/project.json` after linking)
     - `VERCEL_PROJECT_ID`: Your Vercel project ID (found in `.vercel/project.json` after linking)
     - `REACT_APP_API_URL`: Your backend API URL (after backend is deployed)

3. **Automatic Deployment**
   - Push changes to `main` branch
   - GitHub Actions will automatically deploy both frontend and backend

### Option 3: Deploy Backend to Render

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `MedBridge` repository

3. **Configure Service**
   - **Name**: `medbridge-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

4. **Environment Variables**
   Add all environment variables from the backend `.env.example`

5. **Deploy**
   - Click "Create Web Service"
   - Copy your backend URL

6. **Update Frontend**
   - Update `REACT_APP_API_URL` in frontend environment variables to point to Render URL

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Add to Environment Variables**
   - Add `MONGODB_URI` to your backend deployment platform

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Frontend can communicate with backend (check browser console)
- [ ] MongoDB connection is working
- [ ] API keys are configured correctly
- [ ] CORS is properly configured
- [ ] Environment variables are set in production

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set in backend environment variables
- Update CORS configuration in `backend/index.js` to include your frontend URL

### API Connection Issues
- Verify `REACT_APP_API_URL` is set correctly in frontend
- Check backend logs for errors
- Ensure backend URL doesn't have trailing slash

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

## Manual Deployment Commands

If you prefer to deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd frontend
vercel --prod
```

## Support

For issues or questions:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Render documentation: [render.com/docs](https://render.com/docs)
- Review application logs in your deployment platform dashboard

