import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Sparkles } from 'lucide-react';

// Chat Header Component
const ChatHeader = ({ sidebarOpen, onToggleSidebar }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 p-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-2xl relative z-10"
    >
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left header group. When sidebar is closed we absolutely position the visible block
            on large screens but render an invisible duplicate spacer to preserve layout width. */}
        <div className="relative flex items-center">
          {/* Visible block (fixed on lg when sidebar closed so it sits flush to viewport left) */}
          <div className={`flex items-center gap-4 ${!sidebarOpen ? 'lg:fixed lg:left-4 lg:top-4 lg:z-50' : ''}`}>
            <motion.button
              onClick={onToggleSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all border border-slate-700/30 hover:border-cyan-500/30"
            >
              <Menu className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
            </motion.button>

            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <Sparkles className="w-6 h-6 text-white relative z-10" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 shadow-lg shadow-green-400/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(74, 222, 128, 0.4)',
                      '0 0 0 6px rgba(74, 222, 128, 0)',
                      '0 0 0 0 rgba(74, 222, 128, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ami
                </h1>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                    animate={{
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-slate-400 font-medium">Always Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invisible spacer duplicate to preserve header width when the visible block is positioned absolute on lg */}
          {(!sidebarOpen) && (
            <div className="invisible lg:block" aria-hidden="true">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12" />
                <div>
                  <div className="h-4 w-24" />
                  <div className="h-3 w-32 mt-2" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;