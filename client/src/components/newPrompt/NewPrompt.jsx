import './newPrompt.css';
import Upload from '../upload/Upload';
import openai from '../../lib/openai'; // Replace the Gemini model import
import Markdown from 'react-markdown';
import { IKContext, IKImage } from 'imagekitio-react';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import makeAPICall from '../../lib/openai';
import { useNavigate } from 'react-router-dom';

const INITIAL_CHAT_HISTORY = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [{ text: "Great to meet you. What would you like to know?" }],
  },
];

const INITIAL_IMG_STATE = {
  isLoading: false,
  error: "",
  dbData: {},
  aiData: {},
};

const NewPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // Get AI response
      const aiResponse = await makeAPICall(prompt);
      
      // Create chat with valid content
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title: prompt.substring(0, 50),
          history: [{
            question: prompt,
            answer: aiResponse
          }]
        })
      });

      if (!response.ok) throw new Error('Failed to create chat');
      
      const chat = await response.json();
      navigate(`/dashboard/chats/${chat._id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        required
      />
      <button type="submit" disabled={isLoading || !prompt.trim()}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};

NewPrompt.propTypes = {
  data: PropTypes.object.isRequired
};

export default NewPrompt;