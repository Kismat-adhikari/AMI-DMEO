import React from 'react';
import { motion } from 'framer-motion';

// Voice Wave Animation Component
const VoiceWave = ({ isRecording = false, audioLevel = 0, studyMode = false }) => {
  const waveCount = 5;
  
  // Calculate wave heights based on audio level
  const getWaveHeight = (index) => {
    if (!isRecording) return 3;
    
    // Base height when no audio
    const baseHeight = 8;
    
    // Convert audio level (0-1) to wave height multiplier
    const levelMultiplier = audioLevel * 3; // Max 3x multiplier
    
    // Different bars respond differently to create wave effect
    const centerIndex = Math.floor(waveCount / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const waveResponse = Math.max(0, 1 - distanceFromCenter * 0.3);
    
    return baseHeight + (levelMultiplier * waveResponse * 20);
  };
  
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: waveCount }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${
            studyMode 
              ? 'bg-gradient-to-t from-purple-400 to-indigo-300' 
              : 'bg-gradient-to-t from-orange-400 to-amber-300'
          }`}
          animate={{
            height: getWaveHeight(i),
            opacity: isRecording ? (0.5 + audioLevel * 0.5) : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;