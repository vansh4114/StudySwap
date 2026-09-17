import { BookOpen, Bookmark, FilePlus, LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8 pb-2">
      <div className="max-w-7xl mx-auto">
        <nav className="bg-[#101416]/85 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between transition-all duration-300">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[#F5F5F5] hover:opacity-90 transition-opacity"
            >
              <div className="p-1.5 rounded-lg bg-[#DFFF00]/10 border border-[#DFFF00]/20 text-[#DFFF00]">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>
                Study<span className="text-[#DFFF00]">Swap</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-white/10 text-[#F5F5F5] border border-white/10'
                  : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5'
              }`}
            >
              Browse Notes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive('/upload')
                      ? 'bg-[#DFFF00] text-[#050708] font-bold shadow-[0_0_12px_rgba(223,255,0,0.2)]'
                      : 'text-[#DFFF00] bg-[#DFFF00]/10 hover:bg-[#DFFF00]/20 border border-[#DFFF00]/30'
                  }`}
                >
                  <FilePlus className="h-3.5 w-3.5" />
                  <span>Upload</span>
                </Link>

                <Link
                  to="/bookmarks"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive('/bookmarks')
                      ? 'bg-white/10 text-[#F5F5F5] border border-white/10'
                      : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Bookmarks</span>
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive('/admin')
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                        : 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 text-purple-400" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="h-4 w-px bg-white/10 mx-2"></div>

                <Link
                  to="/profile"
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center space-x-2 border ${
                    isActive('/profile')
                      ? 'bg-white/15 text-[#F5F5F5] border-white/20'
                      : 'bg-white/5 text-[#A5A8AA] border-white/10 hover:text-[#F5F5F5] hover:bg-white/10'
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-[#DFFF00]" />
                  <span className="truncate max-w-[110px]">{user?.name || 'Profile'}</span>
                  {user?.contributionPoints !== undefined && (
                    <span className="bg-[#DFFF00] text-[#050708] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      ⭐ {user.contributionPoints}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full text-[#A5A8AA] hover:text-[#FF5C5C] hover:bg-red-500/10 transition-colors ml-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C5C]"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#DFFF00] text-[#050708] hover:bg-[#CFFF00] transition-all shadow-[0_0_15px_rgba(223,255,0,0.2)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#A5A8AA] hover:text-[#F5F5F5] p-2 rounded-full hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-[#101416]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-white/10 text-[#F5F5F5]'
                  : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5'
              }`}
            >
              Browse Notes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold bg-[#DFFF00] text-[#050708]"
                >
                  <span className="flex items-center space-x-2">
                    <FilePlus className="h-4 w-4" />
                    <span>Upload Resource</span>
                  </span>
                  <span className="text-xs bg-[#050708]/20 px-2 py-0.5 rounded-full font-bold">+10 pts</span>
                </Link>

                <Link
                  to="/bookmarks"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/bookmarks')
                      ? 'bg-white/10 text-[#F5F5F5]'
                      : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5'
                  }`}
                >
                  <Bookmark className="h-4 w-4 text-[#A5A8AA]" />
                  <span>My Bookmarks</span>
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20"
                  >
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-[#F5F5F5] bg-white/5 border border-white/10"
                >
                  <span className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-[#DFFF00]" />
                    <span>{user?.name || 'Profile'}</span>
                  </span>
                  <span className="bg-[#DFFF00] text-[#050708] text-xs font-extrabold px-2 py-0.5 rounded-full">
                    ⭐ {user?.contributionPoints || 0} pts
                  </span>
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-[#FF5C5C] hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-xl text-sm font-semibold text-[#F5F5F5] bg-white/5 border border-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-xl text-sm font-bold bg-[#DFFF00] text-[#050708] shadow-[0_0_15px_rgba(223,255,0,0.2)]"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
