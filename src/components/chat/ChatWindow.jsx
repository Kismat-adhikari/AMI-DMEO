import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

// Chat Window Component
const ChatWindow = React.forwardRef(({ messages, isTyping }, ref) => {
  const scrollRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    resetScrollState: () => {
      setUserScrolledUp(false);
    }
  }));

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolledUp(!isNearBottom);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when messages change, but only if user hasn't scrolled up
    if (!userScrolledUp) {
      const timeoutId = setTimeout(() => scrollToBottom(true), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, userScrolledUp]);

  useEffect(() => {
    // Always scroll to bottom when typing status changes (new message or typing indicator)
    if (isTyping) {
      const timeoutId = setTimeout(() => scrollToBottom(true), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isTyping]);

  useEffect(() => {
    // Initial scroll to bottom without animation
    scrollToBottom(false);
  }, []);

  return (
    <div className="flex-1 relative">
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden px-6 py-6 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600/50 scroll-smooth"
      >
        <div className="space-y-6 pb-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isBot={msg.isBot} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          {/* Bottom spacing so last message doesn't touch the input field */}
          <div className="h-4" />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {userScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setUserScrolledUp(false);
              scrollToBottom(true);
            }}
            className="absolute bottom-6 right-6 p-3 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-full text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all z-10"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;