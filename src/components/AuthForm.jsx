import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type = 'login' }) => {
  const isSignup = type === 'signup';
  const navigate = useNavigate();

  // form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const apiBase = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      if (!fullName.trim() || !email.trim() || !password) {
        setError('Please provide name, email and password.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fullName, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          // backend uses { error: '...' } in many endpoints
          setError(data.error || data.message || 'Signup failed');
          setLoading(false);
          return;
        }

  setSuccess('Account created successfully.');
  // mark as logged in in localStorage so Navbar can react
  try { localStorage.setItem('ami_logged_in', '1'); } catch (e) { /* ignore */ }
  // keep loading true while we show spinner and redirect
  setTimeout(() => navigate('/ami'), 900);
      } catch (err) {
        // Try an alternate host (127.0.0.1) if using localhost and we hit a network error
        if (apiBase.includes('localhost')) {
          try {
            const alt = apiBase.replace('localhost', '127.0.0.1');
            const res2 = await fetch(`${alt}/api/auth/signup`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: fullName, email, password }),
            });
            const data2 = await res2.json();
            if (!res2.ok) {
              setError(data2.error || data2.message || 'Signup failed');
              setLoading(false);
              return;
            }

            setSuccess('Account created successfully.');
            try { localStorage.setItem('ami_logged_in', '1'); } catch (e) { /* ignore */ }
            // keep loading true while we show spinner and redirect
            setTimeout(() => navigate('/ami'), 900);
            return;
          } catch (err2) {
            setError((err2 && err2.message) || 'Network error (tried localhost and 127.0.0.1)');
            setLoading(false);
            return;
          }
        }

        setError(err.message || 'Network error');
        setLoading(false);
      }
    } else {
      // login flow
      if (!email.trim() || !password) {
        setError('Please provide email and password.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || data.message || 'Login failed');
          setLoading(false);
          return;
        }

  setSuccess('Logged in.');
  try { localStorage.setItem('ami_logged_in', '1'); } catch (e) { /* ignore */ }
  // keep loading true while we show spinner and redirect
  setTimeout(() => navigate('/ami'), 700);
      } catch (err) {
        // fallback try 127.0.0.1 if localhost had issues
        if (apiBase.includes('localhost')) {
          try {
            const alt = apiBase.replace('localhost', '127.0.0.1');
            const res2 = await fetch(`${alt}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            const data2 = await res2.json();
            if (!res2.ok) {
              setError(data2.error || data2.message || 'Login failed');
              setLoading(false);
              return;
            }

            setSuccess('Logged in.');
            try { localStorage.setItem('ami_logged_in', '1'); } catch (e) { /* ignore */ }
            // keep loading true while we show spinner and redirect
            setTimeout(() => navigate('/ami'), 700);
            return;
          } catch (err2) {
            setError((err2 && err2.message) || 'Network error (tried localhost and 127.0.0.1)');
            setLoading(false);
            return;
          }
        }

        setError(err.message || 'Network error');
        setLoading(false);
      }
    }
  };

  return (
    <motion.div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={animations.fadeIn}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
      <p className="text-gray-600 text-sm mb-6 text-center">{isSignup ? 'Sign up to get started with your AI assistant' : 'Sign in to continue to your dashboard'}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3"
              placeholder="Jane Doe"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-3"
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={loading}
          className={`w-full mt-2 px-6 py-3 text-white rounded-lg font-semibold shadow-lg transition-transform ${loading ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:-translate-y-1'}`}
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-3">
              <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>{isSignup ? 'Creating...' : 'Signing in...'}</span>
            </span>
          ) : (isSignup ? 'Create account' : 'Sign in')}
        </button>

        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-2 text-center">{success}</p>}

        <div className="text-center text-sm text-gray-500 mt-4">
          {/* Google Sign-in button (UI only) */}
          <button
            type="button"
            aria-label="Sign in with Google"
            className="mt-2 inline-flex items-center justify-center gap-3 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => { /* UI only: integration goes here */ }}
          >
            {/* Official Google G - multi-color */}
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.3-4.6-50.6H272v95.8h147.5c-6.4 34.6-25.9 63.9-55.3 83.6v69.4h89.3c52.4-48.2 82.0-119.4 82.0-198.2z"/>
              <path fill="#34A853" d="M272 544.3c73.6 0 135.5-24.3 180.7-66.2l-89.3-69.4c-24.9 16.9-56.9 26.8-91.4 26.8-70.3 0-129.9-47.4-151.2-111.1H30.4v69.8C75.6 489.9 168.2 544.3 272 544.3z"/>
              <path fill="#FBBC05" d="M120.8 325.9c-11.6-34.6-11.6-71.9 0-106.5V149.6H30.4c-39.7 77.5-39.7 169.9 0 247.4l90.4-71.1z"/>
              <path fill="#EA4335" d="M272 107.7c38.1 0 72.3 13.1 99.3 38.8l74.5-74.5C403.3 24.8 344.9 0 272 0 168.2 0 75.6 54.4 30.4 149.6l90.4 69.8C142.1 155.1 201.7 107.7 272 107.7z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;
