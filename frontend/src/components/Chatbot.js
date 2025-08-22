import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    const botResponse = generateResponse(input);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
    
    setInput('');
  };

  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('walk') || lowerInput.includes('exercise')) {
      return "I can help you track walks! How long was your pet's walk?";
    } else if (lowerInput.includes('meal') || lowerInput.includes('food') || lowerInput.includes('eat')) {
      return "Let me know about your pet's meals. What did they eat?";
    } else if (lowerInput.includes('medication') || lowerInput.includes('medicine') || lowerInput.includes('pill')) {
      return "I can help track medications. What did you give your pet?";
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm your pet activity assistant. How can I help you today?";
    }
    
    return "I'm still learning about pet activities. Try asking about walks, meals, or medications!";
  };

  return (
    <div className="chatbot">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your pet's activities..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;