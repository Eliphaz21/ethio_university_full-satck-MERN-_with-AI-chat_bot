
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const lowerEmail = email.trim().toLowerCase();
      if (!lowerEmail || !password) {
        throw new Error('Email and password are required.');
      }

      const res = await api.postLogin({ email: lowerEmail, password });
      const { token, user: backendUser } = res;
      const role = backendUser.role === 'admin' ? 'admin' : 'user';
      onLogin({
        id: String(backendUser.id),
        username: backendUser.username,
        email: backendUser.email,
        role,
        token,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Login</h1>
          <p className="text-slate-500 mt-3 text-lg">Sign in to the EthioUni Ecosystem</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-black py-4.5 rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 mt-4 text-lg uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Login"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-500 border-t border-slate-50 pt-8">
          New to the portal? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
