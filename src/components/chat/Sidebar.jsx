import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Clock, Plus, TrendingUp, Brain, Code, BarChart3 } from 'lucide-react';

// Sidebar Component - ChatGPT Style
const Sidebar = ({ isOpen, onToggle }) => {
  /*
    The placeholder conversations list below is intentionally kept for later
    use as sample data / visual placeholders. The user asked to COMMENT this
    out (do not remove) so it is not shown presently but remains available
    for future work.

  const conversations = [
    { id: 1, title: 'Stock Analysis Dashboard', time: '2m ago', icon: TrendingUp },
    { id: 2, title: 'Biology Flashcards', time: '1h ago', icon: Brain },
    { id: 3, title: 'Python Quiz Generator', time: '3h ago', icon: Code },
    { id: 4, title: 'Market Trends Chart', time: '5h ago', icon: BarChart3 },
  ];
  */

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile: sits behind the sidebar and closes it when tapped */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={onToggle}
          />

          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 flex-shrink-0 overflow-x-hidden w-[240px] max-w-[240px] lg:relative lg:z-auto"
          >
          <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-white flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Conversations
              </motion.h2>
            </div>

            {/* New Chat Button */}
            <motion.button 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium mb-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">New Chat</span>
            </motion.button>

            {/*
              Conversations List (COMMENTED OUT)
              The example conversation items were intentionally present as layout
              placeholders. They are commented so they won't be shown now but can
              be restored later by uncommenting.

            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {conversations.map((conv, idx) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ x: 3 }}
                  className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/50 hover:border-cyan-500/30 cursor-pointer transition-all group max-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-800 rounded-md group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all">
                      <conv.icon className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0 max-w-[120px]">
                      <p className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                        {conv.title}
                      </p>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {conv.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            */}

            {/* Temporary placeholder shown while example conversation items are hidden. */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-3">Conversation placeholders are hidden for now.</p>
                <button
                  onClick={() => {
                    // Placeholder action: later this should open or create a chat with Mr. Pasa
                    // For now we just log to console; the UI text invites the user to start the conversation.
                    console.log('Start a conversation with Mr. Pasa');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-xl font-medium hover:opacity-95 transition"
                >
                  Start a conversation with Mr. Pasa
                </button>
                <p className="text-xs text-slate-500 mt-2">Click to create a sample chat and view the history.</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/50 space-y-2">
              <button className="w-full flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/50 p-3 rounded-xl transition-all group">
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </motion.aside>
          </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;