import { AlertCircle, BookOpen, KeyRound, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(formData);
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#DFFF00]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#101416] p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-extrabold tracking-tight text-[#F5F5F5] mb-4">
            <div className="p-2 rounded-xl bg-[#DFFF00]/10 border border-[#DFFF00]/25 text-[#DFFF00]">
              <BookOpen className="h-6 w-6" />
            </div>
            <span>
              Study<span className="text-[#DFFF00]">Swap</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F5F5] tracking-tight">Welcome Back</h2>
          <p className="text-xs text-[#A5A8AA] mt-1.5 leading-relaxed">
            Sign in to upload, bookmark, and exchange verified study materials
          </p>
        </div>

        {error && (
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#FF5C5C]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#DFFF00] text-[#050708] font-extrabold text-xs rounded-full hover:bg-[#CFFF00] disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(223,255,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A5A8AA]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#DFFF00] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00] rounded px-1">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
