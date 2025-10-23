import React from 'react';
import { motion } from 'framer-motion';

// Animated Background Component with Particles
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]"
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[100px]"
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
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
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