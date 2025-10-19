import React from 'react';
import { MessageSquare, Calendar, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <div 
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 animate-slide-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat",
      description: "Engage in natural conversations with our advanced AI assistant. Get instant answers, creative ideas, and helpful suggestions for any task or question."
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Seamlessly sync with your Google Calendar. Schedule meetings, set reminders, and manage your time effectively with AI-powered scheduling assistance."
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Organize your to-do lists effortlessly. Connect your Google Tasks and let AI help you prioritize, track, and complete your daily goals with ease."
    }
  ];

  return (
    <motion.section className="py-24 bg-gray-50" initial="hidden" animate="visible" variants={animations.stagger}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={animations.fadeIn}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to boost your productivity and simplify your daily workflow
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" variants={animations.stagger}>
          {features.map((feature, index) => (
            <motion.div key={index} variants={animations.slideUp}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div className="mt-20 text-center" variants={animations.fadeIn}>
          <div className="inline-block bg-white rounded-2xl p-12 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              Join thousands of users who are already boosting their productivity with our AI assistant
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started Free
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;