import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Menu, X, MessageSquare, Settings, Clock, Sparkles, TrendingUp, Brain, BookOpen, Plus, Zap, Code, BarChart3, Image, File } from 'lucide-react';

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

// Sidebar Component - ChatGPT Style
const Sidebar = ({ isOpen, onToggle }) => {
  const conversations = [
    { id: 1, title: 'Stock Analysis Dashboard', time: '2m ago', icon: TrendingUp },
    { id: 2, title: 'Biology Flashcards', time: '1h ago', icon: Brain },
    { id: 3, title: 'Python Quiz Generator', time: '3h ago', icon: Code },
    { id: 4, title: 'Market Trends Chart', time: '5h ago', icon: BarChart3 },
  ];

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
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 flex-shrink-0 overflow-hidden lg:relative lg:z-auto"
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

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {conversations.map((conv, idx) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/50 hover:border-cyan-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all">
                      <conv.icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                        {conv.title}
                      </p>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {conv.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
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

// Chat Window Component
const ChatWindow = ({ messages, isTyping }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600/50"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isBot={msg.isBot} />
        ))}
        {isTyping && <TypingIndicator />}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Message Input
const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);

  // useLayoutEffect so we can measure DOM synchronously after render
  useLayoutEffect(() => {
    if (!menuOpen) {
      setMenuStyle(null);
      return;
    }

    function updatePosition() {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;

      const btnRect = btn.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const menuHeight = menuRect.height || 140;
      const menuWidth = menuRect.width || 180;

      // prefer above
      let top = btnRect.top - menuHeight - 8;
      // if not enough space, place below (but prefer above)
      if (top < 8) top = btnRect.bottom + 8;

      let left = btnRect.left + btnRect.width / 2 - menuWidth / 2;
      left = Math.max(8, Math.min(left, viewportWidth - menuWidth - 8));

      setMenuStyle({ top: `${top}px`, left: `${left}px` });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [menuOpen]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-2xl">
      <div className="flex gap-3 items-end max-w-5xl mx-auto">
        {/* Plus button (left of typing field) */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen((s) => !s)}
            ref={btnRef}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all relative z-20"
          >
            <motion.div
              animate={{ rotate: menuOpen ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* swap icons visually: Plus when closed, X when open */}
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>

          {/* Backdrop to close the menu when clicking outside */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Tooltip menu rendered into document.body via portal so it's always on top */}
          {menuOpen && createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={menuStyle || {}}
                className="fixed bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 min-w-[180px]"
              >
                <div className="py-2">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <Brain className="w-4 h-4 text-purple-400" />
                    Study Mode
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <Image className="w-4 h-4 text-cyan-400" />
                    Insert Image
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <File className="w-4 h-4 text-emerald-400" />
                    Insert File
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
        </div>

        <div className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Ami anything... (charts, quizzes, flashcards & more)"
            className="w-full bg-transparent text-white placeholder-slate-500 outline-none resize-none max-h-40 text-sm leading-relaxed"
            rows="1"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl text-white hover:shadow-2xl hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <Send className="w-5 h-5 relative z-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <Mic className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 max-w-5xl mx-auto flex-wrap">
        {[
          { icon: TrendingUp, label: 'Stock Chart' },
          { icon: Brain, label: 'Quiz Me' },
          { icon: BookOpen, label: 'Flashcards' },
          { icon: Zap, label: 'Quick Answer' },
        ].map((action, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-cyan-500/50 text-xs font-medium transition-all flex items-center gap-2 group"
          >
            <action.icon className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Main Ami Component
const Ami = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! I'm Ami, your intelligent AI companion. I can help you analyze stocks, create interactive quizzes, generate flashcards, and so much more. What would you like to explore today?",
      isBot: true,
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text) => {
    const userMessage = {
      id: messages.length + 1,
      text,
      isBot: false,
      time: 'Just now',
    };
    setMessages([...messages, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      // Detect if user wants special content
      let response = "I understand your question. I'm here to assist you with anything you need. This is a demo response - in a real implementation, I would provide intelligent, contextual responses to your queries.";
      let content = null;

      if (text.toLowerCase().includes('stock') || text.toLowerCase().includes('chart')) {
        content = (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Stock Chart Preview</span>
            </div>
            <div className="h-48 bg-slate-950/50 rounded-lg border border-slate-700/30 flex items-center justify-center">
              <p className="text-slate-500 text-sm">Chart visualization would appear here</p>
            </div>
          </div>
        );
        response = "Here's a preview of the stock chart. In production, this would show real-time data with interactive visualizations.";
      } else if (text.toLowerCase().includes('quiz') || text.toLowerCase().includes('mcq')) {
        content = (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Multiple Choice Quiz</span>
            </div>
            <div className="space-y-2">
              {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
                <button key={i} className="w-full p-3 bg-slate-950/50 border border-slate-700/30 rounded-lg text-left hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all text-sm">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
        response = "Here's an interactive quiz! Select an answer to continue.";
      } else if (text.toLowerCase().includes('flashcard')) {
        content = (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-semibold text-pink-400">Flashcard</span>
            </div>
            <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg border border-slate-700/30 flex items-center justify-center p-6">
              <p className="text-center text-slate-300">Tap to flip</p>
            </div>
          </div>
        );
        response = "Here's your flashcard! Click it to reveal the answer.";
      }

      const botMessage = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        time: 'Just now',
        content: content,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden">
      <AnimatedBackground />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Enhanced Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-2xl relative z-10"
          >
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {/* Left header group. When sidebar is closed we absolutely position the visible block
                  on large screens but render an invisible duplicate spacer to preserve layout width. */}
              <div className="relative flex items-center">
                {/* Visible block (fixed on lg when sidebar closed so it sits flush to viewport left) */}
                <div className={`flex items-center gap-4 ${!sidebarOpen ? 'lg:fixed lg:left-4 lg:top-4 lg:z-50' : ''}`}>
                  <motion.button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
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

          {/* Chat Window */}
          <ChatWindow messages={messages} isTyping={isTyping} />

          {/* Message Input */}
          <MessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
};

export default Ami;