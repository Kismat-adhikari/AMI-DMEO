import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Enhanced Typing Indicator
const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex gap-4 justify-start"
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-xl">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;