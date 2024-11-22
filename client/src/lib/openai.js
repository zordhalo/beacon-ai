import OpenAI from 'openai';
import { therapistPrompt, USER_HEADER, ASSISTANT_HEADER } from './therapistPrompt.js';

// Create OpenAI client instance
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_SAMBANOVA_API_KEY,
  baseURL: import.meta.env.VITE_SAMBANOVA_API_URL,
  dangerouslyAllowBrowser: true,
  timeout: 30000
});

const makeAPICall = async (message) => {
  try {
    const fullPrompt = `${therapistPrompt}${USER_HEADER}${message}${ASSISTANT_HEADER}`;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        prompt: fullPrompt,
        model: "Meta-Llama-3.1-70B-Instruct"
      }),
      signal: AbortSignal.timeout(30000)
    });

    // Add more detailed error handling
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${response.status} - ${error.message || error.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return extractAssistantResponse(data.answer);

  } catch (error) {
    console.error("Error calling AI API:", error);
    throw error;
  }
};

// Helper function to extract assistant's response
const extractAssistantResponse = (fullResponse) => {
  if (!fullResponse) return '';

  const parts = fullResponse.split(ASSISTANT_HEADER);
  return parts[parts.length - 1].trim() || fullResponse;
};

export default makeAPICall;