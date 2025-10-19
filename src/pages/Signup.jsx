import React from 'react';
import AuthForm from '../components/AuthForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-blue-50 p-8" initial="hidden" animate="visible" variants={animations.fadeIn}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">Create an account</h1>
              <p className="text-gray-600">Set up your account to start using the AI assistant. It only takes a minute.</p>
            </div>
            <div>
              <AuthForm type="signup" />
              <p className="text-sm text-center text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Signup;