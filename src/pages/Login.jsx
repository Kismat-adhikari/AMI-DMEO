import React from 'react';
import AuthForm from '../components/AuthForm';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-blue-50 p-8" initial="hidden" animate="visible" variants={animations.fadeIn}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-600">Sign in to access your AI assistant and manage your calendar, tasks, and chats from one place.</p>
            </div>
            <div>
              <AuthForm type="login" />
              <p className="text-sm text-center text-gray-500 mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
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


export default Login;