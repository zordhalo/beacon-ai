const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// In-memory cache for API responses
const responseCache = new Map();
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

// Generate cache key based on message and model
const generateCacheKey = (message, model) => {
  return `${message}|${model}`;
};

// Clean expired cache entries
const cleanExpiredEntries = () => {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
};

// Manage cache size limit
const manageCacheSize = () => {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (first in, first out)
    const firstKey = responseCache.keys().next().value;
    if (firstKey) {
      responseCache.delete(firstKey);
    }
  }
};

const makeAPICall = async (message) => {
  try {
    // Check if user has enabled GPT-5
    const useGPT5 = localStorage.getItem('useGPT5') === 'true';
    const model = useGPT5 ? "gpt-5-preview" : "Meta-Llama-3.1-70B-Instruct";
    
    // Generate cache key and check for cached response
    const cacheKey = generateCacheKey(message, model);
    cleanExpiredEntries(); // Clean expired entries before checking cache
    
    const cachedEntry = responseCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp) <= CACHE_DURATION) {
      console.log("Cache hit for message:", message.substring(0, 50) + "...");
      return cachedEntry.response;
    }
    
    // Define your prompt directly or fetch it from a frontend-safe source
    const fullPrompt = `Your predefined therapist prompt here.\nUser: ${message}\nAssistant:`;
    console.log("Full Prompt:", fullPrompt); // Added logging
    console.log("Cache miss - making API call for message:", message.substring(0, 50) + "...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Reduced timeout to 20 seconds
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        prompt: fullPrompt,
        model: model
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

    // Cache the response
    manageCacheSize(); // Ensure we don't exceed cache size limit
    responseCache.set(cacheKey, {
      response: extracted,
      timestamp: Date.now()
    });
    console.log("Response cached for key:", cacheKey.substring(0, 50) + "...");

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