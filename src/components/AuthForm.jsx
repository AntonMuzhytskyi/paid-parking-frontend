import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { Link } from 'react-router-dom';

const AuthForm = ({ isRegister = false }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isRegister
        ? await authAPI.register({ username: form.username, password: form.password })
        : await authAPI.login({ username: form.username, password: form.password });

      localStorage.setItem('token', response.data.token);

      window.location.href = '/dashboard';

    } catch (err) {
      setError(isRegister ? 'Registration error' : 'Wrong login or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepBlack flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-darkSlate rounded-3xl shadow-samurai border-4 border-samuraiRed p-10">
          <h2 className="text-5xl font-bold text-center mb-12 tracking-wider text-goldAccent">
            {isRegister ? 'Register' : 'Login'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-6 py-5 bg-deepBlack rounded-xl border-2 border-gray-800 focus:border-samuraiRed outline-none text-xl transition text-white"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-6 py-5 bg-deepBlack rounded-xl border-2 border-gray-800 focus:border-samuraiRed outline-none text-xl transition text-white"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-samuraiRed to-bloodRed rounded-xl font-bold text-2xl transition transform hover:scale-105 disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
            </button>
          </form>

          {error && <p className="text-bloodRed text-center mt-6 text-xl">{error}</p>}

          <p className="text-center mt-10 text-gray-400 text-lg">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <Link
              to={isRegister ? '/login' : '/register'}
              className="text-samuraiRed hover:text-goldAccent ml-2 font-bold transition"
            >
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
