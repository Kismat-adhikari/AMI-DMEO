import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';

const Footer = () => {
  return (
    <motion.footer className="bg-gray-900 text-gray-300 py-12" initial="hidden" animate="visible" variants={animations.fadeIn}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              AI Assistant
            </h3>
            <p className="text-gray-400">Your intelligent productivity companion</p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a href="#privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#contact" className="hover:text-white transition-colors duration-300">
              Contact
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AI Assistant. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;