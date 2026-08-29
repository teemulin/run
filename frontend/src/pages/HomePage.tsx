import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container py-20 text-center">
        <div className="text-6xl mb-6">🧙‍♂️</div>
        <h1 className="text-5xl font-bold mb-4">Rún - Learn to Code</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master programming through interactive exercises. Learn TypeScript, PHP, and more
          with personalized learning paths designed for your goals.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg">
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="card">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Learn by doing with hands-on coding exercises
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Personalized Paths</h3>
            <p className="text-gray-600">
              Content adapted to your skill level and goals
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey and celebrate wins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
