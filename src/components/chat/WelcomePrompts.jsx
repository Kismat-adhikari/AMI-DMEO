import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Welcome prompts component
const WelcomePrompts = ({ studyMode = false }) => {
  const prompts = [
    "What can I help with?",
    "What's on your mind?", 
    "How can I assist you today?",
    "What would you like to explore?",
    "Ready to learn something new?",
    "What questions do you have?"
  ];
  
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [targetText, setTargetText] = useState(prompts[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commonPrefixLength, setCommonPrefixLength] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing', 'waiting', 'deleting', 'transitioning'

  // Find common prefix between two strings
  const findCommonPrefix = (str1, str2) => {
    let i = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    while (i < minLength && str1[i].toLowerCase() === str2[i].toLowerCase()) {
      i++;
    }
    
    // Find the last complete word in the common prefix
    while (i > 0 && str1[i - 1] !== ' ') {
      i--;
    }
    
    return i;
  };

  // Add natural randomness to typing speed
  const getTypingSpeed = () => {
    const baseSpeed = 80; // More comfortable typing speed
    const randomVariation = Math.random() * 30 - 15; // ±15ms variation
    return Math.max(60, baseSpeed + randomVariation); // Min 60ms, max ~110ms
  };

  const getDeletingSpeed = () => {
    const baseSpeed = 50; // Comfortable deletion speed
    const randomVariation = Math.random() * 20 - 10; // ±10ms variation
    return Math.max(35, baseSpeed + randomVariation); // Min 35ms, max ~70ms
  };

  useEffect(() => {
    const handleAnimation = () => {
      switch (phase) {
        case 'typing':
          if (displayText.length < targetText.length) {
            // Continue typing
            const nextChar = targetText[displayText.length];
            setDisplayText(prev => prev + nextChar);
          } else {
            // Finished typing, wait before transitioning
            setPhase('waiting');
            setTimeout(() => {
              const nextIndex = (currentPromptIndex + 1) % prompts.length;
              const nextPrompt = prompts[nextIndex];
              const prefixLength = findCommonPrefix(targetText, nextPrompt);
              
              setCommonPrefixLength(prefixLength);
              setCurrentPromptIndex(nextIndex);
              
              if (prefixLength === 0) {
                // No common prefix, delete everything
                setPhase('deleting');
              } else if (prefixLength === targetText.length && targetText === nextPrompt) {
                // Texts are identical, just wait and move to next
                setPhase('transitioning');
              } else {
                // Has common prefix, delete only the different part
                setPhase('deleting');
              }
            }, 2500); // Comfortable wait time to read the text
          }
          break;

        case 'deleting':
          if (displayText.length > commonPrefixLength) {
            // Continue deleting to the common prefix
            setDisplayText(prev => prev.substring(0, prev.length - 1));
          } else {
            // Finished deleting, start typing new part
            setTargetText(prompts[currentPromptIndex]);
            setPhase('typing');
          }
          break;

        case 'transitioning':
          // For identical texts or when we need to immediately switch
          setTargetText(prompts[currentPromptIndex]);
          setPhase('typing');
          break;

        default:
          break;
      }
    };

    let speed;
    switch (phase) {
      case 'typing':
        speed = getTypingSpeed();
        break;
      case 'deleting':
        speed = getDeletingSpeed();
        break;
      case 'waiting':
      case 'transitioning':
        return; // Don't set timeout for these phases
      default:
        speed = 50;
    }

    const timeout = setTimeout(handleAnimation, speed);
    return () => clearTimeout(timeout);
  }, [displayText, targetText, phase, currentPromptIndex, commonPrefixLength, prompts]);

  return (
    <div className="text-center mb-8">
      <div className="h-16 md:h-20 flex items-center justify-center">
        <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent transition-all duration-1000 min-w-0 ${
          studyMode 
            ? 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400' 
            : 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
        }`}>
          {displayText}
          <motion.span
            className={`inline-block w-1 ml-1 ${
              studyMode ? 'bg-purple-400' : 'bg-amber-400'
            }`}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            |
          </motion.span>
        </h1>
      </div>
      <p className={`text-lg transition-all duration-1000 ${
        studyMode 
          ? 'text-purple-200/70' 
          : 'text-orange-200/70'
      }`}>
        {studyMode 
          ? 'Deep learning mode - comprehensive explanations and interactive study sessions' 
          : 'I can help with analysis, quizzes, flashcards, and much more'
        }
      </p>
    </div>
  );
};

export default WelcomePrompts;