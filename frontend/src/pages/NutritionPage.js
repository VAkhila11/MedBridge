import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NutritionPage = () => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [Disease, setDisease] = useState('None');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!age || age < 0 || age > 120) {
      setError('Please enter a valid age (0-120)');
      return false;
    }
    if (!height || height < 50 || height > 250) {
      setError('Please enter a valid height (50-250 cm)');
      return false;
    }
    if (!weight || weight < 20 || weight > 300) {
      setError('Please enter a valid weight (20-300 kg)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan("");

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/nutrition`, {
        age,
        height,
        weight,
        gender,
        Disease
      });

      if (!response.data || !response.data.plan) {
        throw new Error("Invalid response from server");
      }

      setPlan(response.data.plan);
    } catch (error) {
      console.error("Error generating nutrition plan:", error);
      setError(error.response?.data?.error || "Failed to generate nutrition plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#e6ffe6', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#28a745' }}>Nutrition Plan</h1>
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            required
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            required
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            required
            disabled={loading}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            disabled={loading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Any existing disease? (Optional)"
            value={Disease}
            onChange={(e) => setDisease(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              background: loading ? '#cccccc' : '#28a745',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? 'Generating Plan...' : 'Generate Plan'}
            
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3f3', borderRadius: '5px', color: 'red' }}>
            <p>{error}</p>
          </div>
        )}

        {plan && (
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '5px' }}>
            <h3>Your Nutrition Plan:</h3>
            <p>{plan}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage;