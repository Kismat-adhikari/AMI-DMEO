import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Enhanced Message Bubble with Rich Content Support
const MessageBubble = ({ message, isBot }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'} group`}
    >
      {isBot && (
        <motion.div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500"
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <Sparkles className="w-5 h-5 text-white relative z-10" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}

      <div
        className={`max-w-[75%] p-4 rounded-2xl backdrop-blur-xl relative overflow-hidden ${
          isBot
            ? 'bg-slate-900/90 border border-slate-700/50 text-slate-100 shadow-xl shadow-slate-900/50'
            : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-cyan-500/30'
        }`}
      >
        {/* Content Container for Charts/MCQ/Flashcards */}
        <div className="space-y-3">
          {message.content && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              {message.content}
            </div>
          )}
          
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <span className="text-xs opacity-60 mt-2 block">{message.time}</span>
        
        {/* Glassmorphism effect */}
        {!isBot && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            initial={false}
          />
        )}
      </div>

      {!isBot && (
        <motion.div 
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg"
          whileHover={{ scale: 1.05, rotate: -5 }}
        >
          <span className="text-sm font-semibold text-white">Y</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;