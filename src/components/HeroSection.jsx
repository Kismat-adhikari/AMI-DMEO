import React from 'react';
import { Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={animations.stagger}
    >
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-20 text-center z-10">
        <motion.div className="max-w-4xl mx-auto space-y-8" variants={animations.stagger}>
          {/* Badge */}
          <motion.div variants={animations.fadeIn}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
            variants={animations.slideUp}
          >
            Your Intelligent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> AI Assistant</span>
          </motion.h1>

          {/* Description */}
          <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={animations.slideUp}
          >
            Chat with AI, manage your Google Calendar, and organize tasks seamlessly. Your personal productivity companion, powered by cutting-edge technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={animations.slideUp}
          >
            <button
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/signup')}
            >
              Sign in with Google
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="px-8 py-4 bg-gray-100 text-gray-800 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-300"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 pt-8" variants={animations.slideUp}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Lightning Fast</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          background-color: #f3f4f6; /* Light gray hover effect */
          color: #1f2937; /* Darker text */
        }
      `}</style>
  </motion.section>
  );
};

export default HeroSection;