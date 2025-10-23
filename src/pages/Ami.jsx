import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

// Import all the extracted components
import AnimatedBackground from '../components/ui/AnimatedBackground';
import Sidebar from '../components/chat/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatWindow from '../components/chat/ChatWindow';
import MessageInput from '../components/chat/MessageInput';
import WelcomePrompts from '../components/chat/WelcomePrompts';

// Main Ami Component
const Ami = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const chatWindowRef = useRef(null);

  // Clean up object URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up all object URLs from messages on unmount
      messages.forEach(message => {
        if (message.images) {
          message.images.forEach(image => {
            if (image.url && image.url.startsWith('blob:')) {
              URL.revokeObjectURL(image.url);
            }
          });
        }
      });
    };
  }, []);

  const handleSendMessage = (text, images = [], attachments = []) => {
    // Mark that chat has started on first message
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    // Process attachments to include file data for display
    const processedAttachments = attachments.map(att => ({
      id: att.id,
      name: att.name,
      size: att.size,
      type: att.type,
      // Keep the file object for potential future upload functionality
      file: att.file
    }));

    const userMessage = {
      id: messages.length + 1,
      text: text.trim(),
      isBot: false,
      time: 'Just now',
      images: images || [],
      attachments: processedAttachments || [],
    };
    setMessages([...messages, userMessage]);
    
    // Reset scroll state when user sends a message
    if (chatWindowRef.current && chatWindowRef.current.resetScrollState) {
      chatWindowRef.current.resetScrollState();
    }

    setIsTyping(true);
    
    setTimeout(() => {
      // Welcome message for first interaction, then detect special content
      let response;
      let content = null;
      
      // Check if files were sent
      const hasImages = images && images.length > 0;
      const hasAttachments = attachments && attachments.length > 0;
      
      if (messages.length === 1) {
        if (hasImages || hasAttachments) {
          response = "Hello! I'm Ami, your intelligent AI companion. I can see you've shared some files with me. I can help analyze images, documents, and answer questions about your attachments. How can I assist you with these files?";
        } else {
          response = "Hello! I'm Ami, your intelligent AI companion. I can help you with analysis, create interactive content, and answer your questions. Let me help you with your request.";
        }
      } else {
        if (hasImages || hasAttachments) {
          response = "I can see the files you've shared. In a real implementation, I would analyze these attachments and provide insights based on their content. What would you like me to help you with regarding these files?";
        } else {
          response = "I understand your question. I'm here to assist you with anything you need. This is a demo response - in a real implementation, I would provide intelligent, contextual responses to your queries.";
        }
      }

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

        <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
          {/* Enhanced Header */}
          <ChatHeader 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          />

          {/* Chat Container - takes remaining space */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {!hasStartedChat ? (
              /* Landing State - Centered Input */
              <motion.div
                className="flex-1 flex items-center justify-center px-6"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full max-w-2xl">
                  <AnimatePresence mode="wait">
                    <WelcomePrompts />
                  </AnimatePresence>
                  
                  {/* Suggested prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8"
                  >
                    {[
                      { text: "Create a quiz about biology", icon: Brain },
                      { text: "Analyze AAPL stock performance", icon: TrendingUp },
                      { text: "Make flashcards for Spanish vocabulary", icon: BookOpen },
                      { text: "Help me understand quantum physics", icon: Sparkles },
                    ].map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(suggestion.text)}
                        className="p-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-left hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <suggestion.icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                            {suggestion.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                  
                  <MessageInput onSend={handleSendMessage} isLandingMode={true} />
                </div>
              </motion.div>
            ) : (
              /* Chat Mode - Normal Layout */
              <motion.div
                className="flex-1 relative flex flex-col overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Chat Window */}
                <ChatWindow ref={chatWindowRef} messages={messages} isTyping={isTyping} />

                {/* Message Input - Fixed at bottom */}
                <div className="flex-shrink-0">
                  <MessageInput onSend={handleSendMessage} isLandingMode={false} />
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Ami;