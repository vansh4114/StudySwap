import { AlertCircle, BookOpen, GraduationCap, KeyRound, Loader2, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    course: '',
    semester: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const value = e.target.name === 'semester' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await registerUser(formData);
      if (res.success && res.token && res.user) {
        register(res.token, res.user);
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
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
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5F5F5] tracking-tight">Create a Student Account</h2>
          <p className="text-xs text-[#A5A8AA] mt-1.5 leading-relaxed">
            Join StudySwap to access and share verified academic resources
          </p>
        </div>

        {error && (
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#FF5C5C]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <User className="h-4 w-4" />
              </div>
              <input
                id="reg-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Password * (min 6 chars)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                id="reg-password"
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-college" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                College / Institution
              </label>
              <input
                id="reg-college"
                type="text"
                name="college"
                autoComplete="organization"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. ABC University"
                className="w-full px-3.5 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="reg-course" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                Course / Branch
              </label>
              <input
                id="reg-course"
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech CS"
                className="w-full px-3.5 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-semester" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
              Current Semester
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#72777A]">
                <GraduationCap className="h-4 w-4" />
              </div>
              <select
                id="reg-semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num} className="bg-[#101416]">
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#DFFF00] text-[#050708] font-extrabold text-xs rounded-full hover:bg-[#CFFF00] disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(223,255,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A5A8AA]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#DFFF00] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFFF00] rounded px-1">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
