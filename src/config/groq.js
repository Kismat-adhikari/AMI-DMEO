// Configuration file for API keys
// API key is now stored in .env file for better security

export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Instructions to set up your Groq API key:
// 1. Get your API key from https://console.groq.com/
// 2. Add it to the .env file in the root directory
// 3. Set VITE_GROQ_API_KEY=your_actual_key_here
// 4. Restart your development server