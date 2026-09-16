import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  Loader2,
  Shield,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import {
  adminDeleteResource,
  getAdminReports,
  getAdminResources,
  getAdminStats,
  getAdminUsers,
  updateReportStatus,
  updateResourceStatus
} from '../services/api';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = (path) => {
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/users')) return 'users';
    return 'overview';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabChange = (tab) => {
    if (tab === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Resources State
  const [resources, setResources] = useState([]);
  const [resourceStatusFilter, setResourceStatusFilter] = useState('');
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Reports State
  const [reports, setReports] = useState([]);
  const [reportStatusFilter, setReportStatusFilter] = useState('');
  const [reportsLoading, setReportsLoading] = useState(false);

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Action Feedback & Deletion Modal
  const [feedback, setFeedback] = useState(null);
  const [deleteResourceId, setDeleteResourceId] = useState(null);

  const showFeedback = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await getAdminStats();
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Admin Resources
  const fetchResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const query = resourceStatusFilter ? `status=${resourceStatusFilter}` : '';
      const res = await getAdminResources(query);
      if (res.success) setResources(res.resources || []);
    } catch (err) {
      console.error('Failed to load admin resources:', err);
    } finally {
      setResourcesLoading(false);
    }
  }, [resourceStatusFilter]);

  // Fetch Admin Reports
  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const query = reportStatusFilter ? `status=${reportStatusFilter}` : '';
      const res = await getAdminReports(query);
      if (res.success) setReports(res.reports || []);
    } catch (err) {
      console.error('Failed to load admin reports:', err);
    } finally {
      setReportsLoading(false);
    }
  }, [reportStatusFilter]);

  // Fetch Admin Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'resources') fetchResources();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchResources, fetchReports]);

  // Resource Moderation Action
  const handleResourceStatusChange = async (id, newStatus) => {
    try {
      const res = await updateResourceStatus(id, newStatus);
      if (res.success) {
        showFeedback(`Resource status updated to ${newStatus}`);
        fetchResources();
        fetchStats();
      }
    } catch (err) {
      showFeedback(err.message || 'Status update failed', true);
    }
  };

  // Resource Deletion Action
  const handleAdminDeleteResource = async () => {
    if (!deleteResourceId) return;
    try {
      const res = await adminDeleteResource(deleteResourceId);
      if (res.success) {
        showFeedback('Resource permanently deleted');
        setDeleteResourceId(null);
        fetchResources();
        fetchStats();
      }
    } catch (err) {
      showFeedback(err.message || 'Delete failed', true);
    }
  };

  // Report Moderation Action
  const handleReportStatusChange = async (id, newStatus) => {
    try {
      const res = await updateReportStatus(id, newStatus);
      if (res.success) {
        showFeedback(`Report status updated to ${newStatus}`);
        fetchReports();
        fetchStats();
      }
    } catch (err) {
      showFeedback(err.message || 'Report update failed', true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Title Banner */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Moderation Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Manage StudySwap resources, user reports, moderation status, and student directory
          </p>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center space-x-2 border animate-in fade-in ${
            feedback.isError
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {feedback.isError ? (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('resources')}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'resources'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Resource Moderation</span>
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Flag className="h-4 w-4" />
          <span>User Reports</span>
        </button>

        <button
          onClick={() => handleTabChange('users')}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>User Directory</span>
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Resources</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats.totalResources}</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Resources</p>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pendingResources}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Reports</p>
                  <p className="text-3xl font-extrabold text-red-600 mt-1">{stats.pendingReports}</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <Flag className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* RESOURCE MODERATION TAB */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Resource Moderation Queue</h3>
            <select
              value={resourceStatusFilter}
              onChange={(e) => setResourceStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg p-2 font-medium focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          {resourcesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No resources found matching filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <th className="p-3 font-semibold">Title / Subject</th>
                    <th className="p-3 font-semibold">Uploader</th>
                    <th className="p-3 font-semibold">Type / Course</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resources.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50/50">
                      <td className="p-3">
                        <p className="font-bold text-gray-900 line-clamp-1">{r.title}</p>
                        <p className="text-xs text-indigo-600 font-medium">{r.subject}</p>
                      </td>
                      <td className="p-3 text-gray-600">
                        <p className="font-medium text-gray-800">{r.uploadedBy?.name || 'Student'}</p>
                        <p className="text-xs text-gray-400">{r.uploadedBy?.email}</p>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-gray-700">{r.resourceType}</span>
                        <p className="text-xs text-gray-500">Sem {r.semester} | {r.course}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : r.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {r.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleResourceStatusChange(r._id, 'APPROVED')}
                            className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 font-medium cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleResourceStatusChange(r._id, 'REJECTED')}
                            className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 font-medium cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteResourceId(r._id)}
                          className="px-2.5 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* USER REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Reported Content Management</h3>
            <select
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs rounded-lg p-2 font-medium focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="RESOLVED">Resolved Only</option>
              <option value="DISMISSED">Dismissed Only</option>
            </select>
          </div>

          {reportsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No reports found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <th className="p-3 font-semibold">Reported Resource</th>
                    <th className="p-3 font-semibold">Reason</th>
                    <th className="p-3 font-semibold">Reported By</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((rep) => (
                    <tr key={rep._id} className="hover:bg-gray-50/50">
                      <td className="p-3">
                        <p className="font-bold text-gray-900">{rep.resource?.title || 'Deleted Resource'}</p>
                        <p className="text-xs text-gray-500">{rep.resource?.subject}</p>
                      </td>
                      <td className="p-3 text-gray-700 max-w-xs">{rep.reason}</td>
                      <td className="p-3 text-gray-600">
                        <p className="font-medium text-gray-800">{rep.reportedBy?.name || 'Student'}</p>
                        <p className="text-xs text-gray-400">{rep.reportedBy?.email}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            rep.status === 'RESOLVED'
                              ? 'bg-green-100 text-green-800'
                              : rep.status === 'DISMISSED'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {rep.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleReportStatusChange(rep._id, 'RESOLVED')}
                            className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 font-medium cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                        {rep.status !== 'DISMISSED' && (
                          <button
                            onClick={() => handleReportStatusChange(rep._id, 'DISMISSED')}
                            className="px-2.5 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 font-medium cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* USER DIRECTORY TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Registered Students Directory</h3>

          {usersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No users registered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">College / Course</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Contribution Points</th>
                    <th className="p-3 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50">
                      <td className="p-3">
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="p-3 text-gray-700">
                        <p className="font-medium">{u.college || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{u.course} (Sem {u.semester || 'N/A'})</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-600">⭐ {u.contributionPoints || 0} pts</td>
                      <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteResourceId}
        onClose={() => setDeleteResourceId(null)}
        onConfirm={handleAdminDeleteResource}
        title="Admin Delete Resource?"
        message="This action will permanently delete the resource, destroy the Cloudinary file asset, and clean up all associated ratings, bookmarks, and reports."
        confirmText="Delete Resource"
        isDanger={true}
      />
    </div>
  );
};

export default AdminDashboard;
