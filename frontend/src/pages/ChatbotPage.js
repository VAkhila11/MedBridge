import React, { useState } from 'react';
import axios from 'axios';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error(error);
    }
    setInput('');
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
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;