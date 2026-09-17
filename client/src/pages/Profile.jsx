import { Award, BookOpen, Building2, Calendar, GraduationCap, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-white/10">
          <div className="h-20 w-20 bg-[#DFFF00]/10 border border-[#DFFF00]/30 text-[#DFFF00] rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-[0_0_20px_rgba(223,255,0,0.1)]">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-extrabold text-[#F5F5F5] tracking-tight">{user.name}</h1>
            <p className="text-xs text-[#A5A8AA] flex items-center justify-center sm:justify-start space-x-1.5 mt-1.5">
              <Mail className="h-3.5 w-3.5 text-[#72777A]" />
              <span>{user.email}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="bg-purple-500/10 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/25 flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                <span>Role: {user.role}</span>
              </span>
              <span className="bg-[#DFFF00] text-[#050708] text-xs font-extrabold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(223,255,0,0.2)] flex items-center space-x-1.5">
                <Award className="h-3.5 w-3.5 text-[#050708]" />
                <span>⭐ {user.contributionPoints || 0} Contribution Points</span>
              </span>
            </div>
          </div>
        </div>

        {/* User Academic Details Grid */}
        <div className="py-6">
          <h3 className="text-xs font-bold text-[#DFFF00] uppercase tracking-wider mb-4">
            Academic Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#151A1D] p-4 rounded-xl border border-white/5 flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-white/5 text-[#DFFF00] border border-white/5">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">College / Institution</p>
                <p className="text-xs font-semibold text-[#F5F5F5]">
                  {user.college || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-[#151A1D] p-4 rounded-xl border border-white/5 flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-white/5 text-[#DFFF00] border border-white/5">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Course / Branch</p>
                <p className="text-xs font-semibold text-[#F5F5F5]">
                  {user.course || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-[#151A1D] p-4 rounded-xl border border-white/5 flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-white/5 text-[#DFFF00] border border-white/5">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Semester</p>
                <p className="text-xs font-semibold text-[#F5F5F5]">
                  {user.semester ? `Semester ${user.semester}` : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-[#151A1D] p-4 rounded-xl border border-white/5 flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-white/5 text-[#DFFF00] border border-white/5">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#72777A] font-semibold">Member Since</p>
                <p className="text-xs font-semibold text-[#F5F5F5]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution System Info Card */}
        <div className="bg-[#151A1D] border border-[#DFFF00]/20 rounded-xl p-5 mt-2">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-4 w-4 text-[#DFFF00]" />
            <h4 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">
              Contribution Points System
            </h4>
          </div>
          <ul className="text-xs text-[#A5A8AA] space-y-2 list-disc list-inside leading-relaxed">
            <li><strong className="text-[#DFFF00]">+10 points</strong> awarded for every approved resource upload.</li>
            <li><strong className="text-[#DFFF00]">+5 points</strong> awarded to you for every 10 downloads of your notes.</li>
            <li><strong className="text-[#DFFF00]">+3 points</strong> awarded to you for every 5 ratings received on your notes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
