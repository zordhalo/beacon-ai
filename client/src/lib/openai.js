const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const makeAPICall = async (message) => {
  try {
    // Define your prompt directly or fetch it from a frontend-safe source
    const fullPrompt = `Your predefined therapist prompt here.\nUser: ${message}\nAssistant:`;
    console.log("Full Prompt:", fullPrompt); // Added logging

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Reduced timeout to 20 seconds

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        prompt: fullPrompt,
        model: "Meta-Llama-3.1-70B-Instruct"
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error Response:", error); // Added logging
      throw new Error(`API error: ${response.status} - ${error.message || error.details || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("AI Response Data:", data); // Added logging
    const extracted = extractAssistantResponse(data.answer);

    return extracted;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("AI API request timed out.");
      throw new Error("AI API request timed out.");
    }
    console.error("Error calling AI API:", error);
    throw error;
  }
};

// Modify the extractAssistantResponse function to ensure correct extraction
const extractAssistantResponse = (fullResponse) => {
  if (!fullResponse) return '';
  // Assuming ASSISTANT_HEADER is no longer used, adjust extraction accordingly
  return fullResponse.trim();
};

export default makeAPICall;