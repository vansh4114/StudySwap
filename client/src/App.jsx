import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import Bookmarks from './pages/Bookmarks';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResourceDetails from './pages/ResourceDetails';
import UploadResource from './pages/UploadResource';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050708] flex flex-col font-sans text-[#F5F5F5] selection:bg-[#DFFF00] selection:text-[#050708] relative overflow-x-hidden">
          {/* Subtle cinematic ambient glow */}
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(223,255,0,0.04),rgba(255,255,255,0))]" />

          <Navbar />

          <main className="flex-1 relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources/:id" element={<ResourceDetails />} />

              {/* Protected Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadResource />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="border-t border-white/10 bg-[#0A0D0F] py-8 text-center text-xs text-[#A5A8AA] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#F5F5F5] text-sm tracking-tight">
                  Study<span className="text-[#DFFF00]">Swap</span>
                </span>
                <span className="text-[#72777A]">|</span>
                <span className="text-[#A5A8AA]">Student-to-Student Academic Platform</span>
              </div>
              <p>StudySwap &copy; {new Date().getFullYear()} — Shared Knowledge for Students</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
