import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Welcome prompts component
const WelcomePrompts = () => {
  const prompts = [
    "What can I help with?",
    "What's on your mind?", 
    "How can I assist you today?",
    "What would you like to explore?",
    "Ready to learn something new?",
    "What questions do you have?"
  ];
  
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [prompts.length]);

  return (
    <motion.div
      key={currentPrompt}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
        {prompts[currentPrompt]}
      </h1>
      <p className="text-slate-400 text-lg">
        I can help with analysis, quizzes, flashcards, and much more
      </p>
    </motion.div>
  );
};

export default WelcomePrompts;