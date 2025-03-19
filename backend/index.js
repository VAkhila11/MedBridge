const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Read doctors data from JSON file
const doctorsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'doctors.json'), 'utf8'));
const doctors = doctorsData.doctors;

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// GET /api/doctors - Get all doctors with optional filters
app.get('/api/doctors', (req, res) => {
  try {
    let filteredDoctors = [...doctors];
    const { search, specialization, location, lat, lng } = req.query;

    // Filter by specialization
    if (specialization && specialization !== 'All Specializations') {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialization === specialization
      );
      console.log(`Filtered by specialization: ${filteredDoctors.length} doctors`);
    }

    // Filter by location
    if (location && location !== 'All Locations') {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.location === location
      );
      console.log(`Filtered by location: ${filteredDoctors.length} doctors`);
    }

    // Search by name, specialization, or location
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm) ||
        doctor.location.toLowerCase().includes(searchTerm)
      );
      console.log(`Search results: ${filteredDoctors.length} doctors`);
    }

    // Calculate distances if user location is provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        filteredDoctors = filteredDoctors.map(doctor => ({
          ...doctor,
          distance: calculateDistance(
            userLat,
            userLng,
            doctor.coordinates.lat,
            doctor.coordinates.lng
          )
        }));

        // Sort by distance
        filteredDoctors.sort((a, b) => a.distance - b.distance);
        console.log('Sorted by distance');
      }
    }

    // Return response
    if (filteredDoctors.length === 0) {
      return res.status(404).json({
        message: 'No doctors found matching your criteria',
        doctors: []
      });
    }

    res.json({
      message: `Found ${filteredDoctors.length} doctors`,
      total: filteredDoctors.length,
      doctors: filteredDoctors
    });

  } catch (error) {
    console.error('Error in /api/doctors:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/doctors/:id - Get a specific doctor by ID
app.get('/api/doctors/:id', (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    
    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found'
      });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error in /api/doctors/:id:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Input validation middleware
const validateNutritionInput = (req, res, next) => {
  const { age, height, weight, gender, Disease } = req.body;

  if (!age || age < 0 || age > 120) {
    return res.status(400).json({ error: 'Invalid age. Must be between 0 and 120.' });
  }
  if (!height || height < 50 || height > 250) {
    return res.status(400).json({ error: 'Invalid height. Must be between 50 and 250 cm.' });
  }
  if (!weight || weight < 20 || weight > 300) {
    return res.status(400).json({ error: 'Invalid weight. Must be between 20 and 300 kg.' });
  }
  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Invalid gender. Must be either "male" or "female".' });
  }

  next();
};

const validateVideoInput = (req, res, next) => {
  const { prompt } = req.body;
  
  if (!prompt || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Invalid prompt. Must be at least 3 characters long.' });
  }
  
  next();
};

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to fetch response from Gemini API'
    });
  }
});

// Nutrition Plan endpoint
app.post('/api/nutrition', validateNutritionInput, async (req, res) => {
  const { age, height, weight, gender, Disease } = req.body;
  
  const prompt = `Generate a structured daily nutrition plan for a ${age}-year-old ${gender}, ${height} cm tall, ${weight} kg weight and ${Disease === 'None' ? 'with no specific health conditions' : `suffering from ${Disease}`}. 
Provide only meal names with clear descriptions and portion sizes. Do not include asterisks, bullet points, disclaimers, or additional text.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    let plan = response.data.candidates[0].content.parts[0].text;

    // Post-processing to clean output
    plan = plan
      .replace(/[*•-]/g, "") // Remove asterisks, bullets, dashes
      .replace(/\n\s*\n/g, "\n") // Remove extra blank lines
      .replace(/\b(Note|Disclaimer|Important):.*$/gim, "") // Remove extra explanations
      .trim();

    res.json({ plan });
  } catch (error) {
    console.error('Nutrition API Error:', error);
    res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to generate nutrition plan'
    });
  }
});

// Video recommendation endpoint
app.post("/api/video-recommendation", validateVideoInput, async (req, res) => {
  const { prompt } = req.body;

  try {
    // Step 1: Get AI-generated search keywords
    const aiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { 
        contents: [{ 
          parts: [{ 
            text: `Generate specific search keywords for finding helpful medical/health videos about: ${prompt}. Return only the keywords separated by spaces, no other text.` 
          }] 
        }] 
      }
    );

    if (!aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const keywords = aiResponse.data.candidates[0].content.parts[0].text.trim();
    console.log("Generated Keywords:", keywords);

    // Step 2: Use keywords to search for YouTube videos
    const youtubeResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          key: YOUTUBE_API_KEY,
          q: keywords,
          part: "snippet",
          maxResults: 5,
          type: "video",
          videoEmbeddable: "true",
          videoDuration: "medium"
        }
      }
    );

    if (!youtubeResponse.data?.items?.length) {
      throw new Error('No videos found for the given keywords');
    }

    // Step 3: Extract relevant video details
    const videos = youtubeResponse.data.items.map((video) => ({
      title: video.snippet.title,
      url: `https://www.youtube.com/embed/${video.id.videoId}`,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url
    }));

    res.json({ videos });
  } catch (error) {
    console.error("Video API Error:", error);
    res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to fetch video recommendations'
    });
  }
});

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
