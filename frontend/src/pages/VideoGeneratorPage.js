import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VideoGeneratorPage = () => {
  const [prompt, setPrompt] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a valid prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setVideos([]);

    try {
      const response = await axios.post(
        `${API_URL}/api/video-recommendation`,
        { prompt }
      );

      if (!response.data || !response.data.videos) {
        throw new Error("Invalid response from server");
      }

      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(error.response?.data?.error || "Failed to fetch video recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#ff6600" }}>AI-Powered Video Generator</h1>
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt (e.g., 'Workout for back pain')"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            background: loading ? "#cccccc" : "#ff6600",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {loading ? "Generating..." : "Generate Videos"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "10px", padding: "10px", backgroundColor: "#fff3f3", borderRadius: "5px" }}>
            <p>{error}</p>
          </div>
        )}

        {videos.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Recommended Videos:</h3>
            {videos.map((video, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4>{video.title}</h4>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  {video.description.slice(0, 100)}...
                </p>
                <iframe
                  width="100%"
                  height="315"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGeneratorPage;
