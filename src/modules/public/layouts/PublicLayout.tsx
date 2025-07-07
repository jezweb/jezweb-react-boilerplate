import React from 'react';
import { Link } from 'react-router-dom';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">React Boilerplate</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
              <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};