// src/components/Login.js
import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const GlobeIcon = () => (
  <svg className="w-16 h-16 mb-4 text-blue-400" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 5 50 Q 50 0 95 50 Q 50 100 5 50" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 50 5 Q 100 50 50 95 Q 0 50 50 5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M 5 50 H 95" stroke="currentColor" strokeWidth="1"/>
    <path d="M 50 5 V 95" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const success = await onLogin(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 w-full h-full">
        <DotLottieReact
          src="https://lottie.host/af2d3124-eeb4-4cb8-bb35-095935253390/RdQ5Fxr8KQ.json"
          loop
          autoplay
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            objectFit: 'cover'
          }}
        /> 
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <GlobeIcon />
          </div>
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Geography Adventure</h1>
          <p className="text-gray-400">Explore, Learn, Discover</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-gray-700 relative">
          <div className="absolute inset-0 bg-blue-500/5 rounded-lg"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Explorer Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input 
                  id="username"
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/70 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/70 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Begin Adventure'}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  New to the adventure?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none focus:underline transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Ready to explore the world of geography?
        </div>
      </div>
    </div>
  );
};

export default Login;