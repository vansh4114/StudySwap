import { BookOpen, Bookmark, FilePlus, LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
              <BookOpen className="h-7 w-7" />
              <span>StudySwap</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Browse Notes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <FilePlus className="h-4 w-4" />
                  <span>Upload</span>
                </Link>

                <Link
                  to="/bookmarks"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Bookmarks</span>
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-purple-700 hover:text-purple-800 font-bold bg-purple-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name || 'Profile'}</span>
                  {user?.contributionPoints !== undefined && (
                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                      ⭐ {user.contributionPoints}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
          >
            Browse Notes
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/upload"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
              >
                Upload Resource
              </Link>
              <Link
                to="/bookmarks"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
              >
                My Bookmarks
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-purple-700 font-bold py-1"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block text-indigo-700 font-medium py-1"
              >
                Profile ({user?.name}) ⭐ {user?.contributionPoints || 0} pts
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left text-red-600 font-medium py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block text-indigo-600 font-medium py-1"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
