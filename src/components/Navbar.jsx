import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header className="bg-white shadow-sm" initial="hidden" animate="visible" variants={animations.fadeIn}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-amiDark">AI Assistant</Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-amiBlue">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-amiBlue">About</Link>
            <Link to="/login" className="text-gray-700 hover:text-amiBlue">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md">Sign up</Link>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} aria-label="Open menu" className="p-2 rounded-md border border-gray-200">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <motion.nav className="md:hidden bg-white border-t border-gray-100" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-gray-700">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="text-gray-700">About</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="text-gray-700">Login</Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="text-gray-700">Sign up</Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Navbar;
