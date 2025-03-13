import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatbotPage from './pages/ChatbotPage';
import NutritionPage from './pages/NutritionPage';
import VideoGeneratorPage from './pages/VideoGeneratorPage';
import DoctorsNearbyPage from './pages/DoctorsNearbyPage';

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa' }}>
        <nav>
          <Link
            to="/"
            style={{
              margin: '10px',
              padding: '10px 20px',
              textDecoration: 'none',
              color: '#fff',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #84fab0, #8fd3f4)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundPosition = '100% 50%';
              e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundPosition = '0% 50%';
              e.target.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            }}
          >
            Chatbot
          </Link>
          <Link
            to="/nutrition"
            style={{
              margin: '10px',
              padding: '10px 20px',
              textDecoration: 'none',
              color: '#fff',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #84fab0, #8fd3f4)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundPosition = '100% 50%';
              e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundPosition = '0% 50%';
              e.target.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            }}
          >
            Nutrition Plan
          </Link>
          <Link
            to="/video"
            style={{
              margin: '10px',
              padding: '10px 20px',
              textDecoration: 'none',
              color: '#fff',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #84fab0, #8fd3f4)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundPosition = '100% 50%';
              e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundPosition = '0% 50%';
              e.target.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            }}
          >
            Video Generator
          </Link>
          <Link
            to="/doctors"
            style={{
              margin: '10px',
              padding: '10px 20px',
              textDecoration: 'none',
              color: '#fff',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #84fab0, #8fd3f4)',
              backgroundSize: '300% 300%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundPosition = '100% 50%';
              e.target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundPosition = '0% 50%';
              e.target.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            }}
          >
            Doctors Nearby
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<ChatbotPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/video" element={<VideoGeneratorPage />} />
          <Route path="/doctors" element={<DoctorsNearbyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;