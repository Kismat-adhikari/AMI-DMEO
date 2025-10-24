import React from 'react';
import { motion } from 'framer-motion';

// Animated Background Component with Particles
const AnimatedBackground = ({ studyMode = false }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 transition-all duration-1000 ${
        studyMode 
          ? 'bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900' 
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      }`} />
      
      {/* Grid Pattern */}
      <div className={`absolute inset-0 bg-[size:100px_100px] transition-all duration-1000 ${
        studyMode 
          ? 'bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.03)_1px,transparent_1px)]'
      }`} />
      
      {/* Animated Orbs */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 ${
          studyMode ? 'bg-purple-500/20' : 'bg-amber-500/20'
        }`}
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-1000 ${
          studyMode ? 'bg-indigo-600/20' : 'bg-orange-600/20'
        }`}
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 ${
          studyMode ? 'bg-blue-500/15' : 'bg-rose-500/15'
        }`}
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full transition-all duration-1000 ${
            studyMode ? 'bg-purple-400/30' : 'bg-amber-400/30'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;