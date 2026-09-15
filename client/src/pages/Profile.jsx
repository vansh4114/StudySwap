import { Award, BookOpen, Building2, Calendar, GraduationCap, Mail, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100">
          <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-3xl">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start space-x-1 mt-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{user.email}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100 flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Role: {user.role}</span>
              </span>
              <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>{user.contributionPoints || 0} Contribution Points</span>
              </span>
            </div>
          </div>
        </div>

        {/* User Academic Details Grid */}
        <div className="py-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">
            Academic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-500">College / Institution</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.college || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-500">Course / Branch</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.course || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-500">Semester</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.semester ? `Semester ${user.semester}` : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution System Info */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-5 mt-4">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
            ⭐ Contribution Points Rules
          </h4>
          <ul className="text-xs text-indigo-800 space-y-1 list-disc list-inside">
            <li><strong>+10 points</strong> for every approved resource upload.</li>
            <li><strong>+5 points</strong> awarded to you for every 10 downloads of your notes.</li>
            <li><strong>+3 points</strong> awarded to you for every 5 ratings received on your notes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
