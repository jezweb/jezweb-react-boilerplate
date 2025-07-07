import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to React Enterprise Boilerplate
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A comprehensive template for building enterprise React applications with TypeScript,
          featuring modern state management, robust form handling, and scalable architecture patterns.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Modern Stack</h3>
            <p className="text-gray-600">
              Built with React 19, TypeScript, Vite, and Tailwind CSS for a modern development experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Enterprise Ready</h3>
            <p className="text-gray-600">
              Includes authentication, state management with Zustand, and API integration patterns.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
            <p className="text-gray-600">
              Follows industry best practices for code organization, testing, and deployment.
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};