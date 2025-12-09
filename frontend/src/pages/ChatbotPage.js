import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { message: input });
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble responding right now.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#007bff' }}>Symptom Checker</h1>
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ height: '400px', overflowY: 'scroll', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: msg.sender === 'user' ? '#007bff' : '#f1f0f0', color: msg.sender === 'user' ? '#fff' : '#000' }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
          placeholder="Type your symptom..."
        />
        <button
          onClick={handleSend}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}
        >
          Send
          
          
          {loading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;