import { OpenAI } from "openai";

class AIService {
  constructor() {
    this.openai = null;
  }

  _getOpenAIClient() {
    if (!this.openai) {
      if (!process.env.SAMBANOVA_API_KEY || !process.env.SAMBANOVA_API_URL) {
        throw new Error("SAMBANOVA_API_KEY and SAMBANOVA_API_URL environment variables are required");
      }
      
      this.openai = new OpenAI({
        apiKey: process.env.SAMBANOVA_API_KEY,
        baseURL: process.env.SAMBANOVA_API_URL,
        timeout: 20000,
        maxRetries: 2,
      });
    }
    return this.openai;
  }

  async generateCompletion(prompt, model = "Meta-Llama-3.1-70B-Instruct") {
    try {
      if (!prompt) {
        throw new Error('Prompt is required');
      }

      const openai = this._getOpenAIClient();
      const isGPT5 = model.toLowerCase().includes('gpt-5');
      let completion;

      if (isGPT5) {
        // GPT-5 uses the chat completion API
        completion = await openai.chat.completions.create({
          model: "gpt-5-preview",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.7,
          timeout: 30000
        });
      } else {
        // Fallback to Meta-Llama for regular completions
        completion = await openai.completions.create({
          model: "Meta-Llama-3.1-70B-Instruct",
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.7,
          timeout: 30000
        });
      }

      console.log("AI Completion Response:", JSON.stringify(completion, null, 2));

      if (!completion || !completion.choices || completion.choices.length === 0) {
        throw new Error("Invalid AI response format");
      }

      // Handle different response formats between completion and chat completion APIs
      let responseText;
      if (isGPT5) {
        responseText = completion.choices[0].message?.content;
      } else {
        responseText = completion.choices[0].text;
      }

      if (!responseText) {
        throw new Error("Invalid AI response format - missing text");
      }

      return {
        answer: responseText,
        model: isGPT5 ? "gpt-5-preview" : "Meta-Llama-3.1-70B-Instruct"
      };

    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('AI service temporarily unavailable. Please try again later!');
    }
  }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;