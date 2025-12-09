import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatWidget = () => {
  const handleNewMessage = async (message) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (data.reply) {
        return data.reply;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  return (
    <Widget
      handleNewMessage={handleNewMessage}
      title="Symptom Checker"
      subtitle="Ask me about your symptoms"
      profileAvatar="https://img.icons8.com/color/96/000000/medical-doctor.png"
      handleQuickButtonClicked={handleNewMessage}
      quickReplies={[
        { label: 'Headache', value: 'I have a headache' },
        { label: 'Fever', value: 'I have a fever' },
        { label: 'Cough', value: 'I have a cough' },
        { label: 'Stomach Pain', value: 'I have stomach pain' },
      ]}
    />
  );
};

export default ChatWidget; 