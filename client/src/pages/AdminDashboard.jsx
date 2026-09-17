import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  Loader2,
  Shield,
  Users
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
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/25 text-purple-400 rounded-2xl">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#DFFF00] uppercase tracking-widest block mb-0.5">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
              Manage StudySwap
            </h1>
            <p className="text-xs text-[#A5A8AA] mt-1">
              Platform moderation, resource approvals, user reports, and student directory
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center space-x-2.5 border animate-in fade-in ${
            feedback.isError
              ? 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30'
              : 'bg-[#B8FF4D]/10 text-[#B8FF4D] border-[#B8FF4D]/30'
          }`}
        >
          {feedback.isError ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF5C5C]" />
          ) : (
            <CheckCircle className="h-4 w-4 shrink-0 text-[#B8FF4D]" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-white/10 mb-8 space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          onClick={() => handleTabChange('overview')}
          aria-label="Overview tab"
          className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center space-x-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
            activeTab === 'overview'
              ? 'bg-[#DFFF00] text-[#050708] shadow-[0_0_15px_rgba(223,255,0,0.2)]'
              : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5 border border-white/10 bg-[#101416]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('resources')}
          aria-label="Resource Moderation tab"
          className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center space-x-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
            activeTab === 'resources'
              ? 'bg-[#DFFF00] text-[#050708] shadow-[0_0_15px_rgba(223,255,0,0.2)]'
              : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5 border border-white/10 bg-[#101416]'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Resource Moderation</span>
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          aria-label="User Reports tab"
          className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center space-x-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
            activeTab === 'reports'
              ? 'bg-[#DFFF00] text-[#050708] shadow-[0_0_15px_rgba(223,255,0,0.2)]'
              : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5 border border-white/10 bg-[#101416]'
          }`}
        >
          <Flag className="h-3.5 w-3.5" />
          <span>User Reports</span>
        </button>

        <button
          onClick={() => handleTabChange('users')}
          aria-label="User Directory tab"
          className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center space-x-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
            activeTab === 'users'
              ? 'bg-[#DFFF00] text-[#050708] shadow-[0_0_15px_rgba(223,255,0,0.2)]'
              : 'text-[#A5A8AA] hover:text-[#F5F5F5] hover:bg-white/5 border border-white/10 bg-[#101416]'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>User Directory</span>
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#101416] border border-white/10 rounded-2xl h-28 animate-pulse p-6"></div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-[#101416] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-extrabold text-[#F5F5F5] mt-1">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-[#101416] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider">Total Resources</p>
                  <p className="text-3xl font-extrabold text-[#F5F5F5] mt-1">{stats.totalResources}</p>
                </div>
                <div className="p-3 bg-[#DFFF00]/10 text-[#DFFF00] border border-[#DFFF00]/20 rounded-2xl">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-[#101416] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider">Pending Resources</p>
                  <p className="text-3xl font-extrabold text-amber-400 mt-1">{stats.pendingResources}</p>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-[#101416] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider">Pending Reports</p>
                  <p className="text-3xl font-extrabold text-[#FF5C5C] mt-1">{stats.pendingReports}</p>
                </div>
                <div className="p-3 bg-[#FF5C5C]/10 text-[#FF5C5C] border border-[#FF5C5C]/20 rounded-2xl">
                  <Flag className="h-6 w-6" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* RESOURCE MODERATION TAB */}
      {activeTab === 'resources' && (
        <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-[#F5F5F5] tracking-tight">Resource Moderation Queue</h3>
            <div className="w-full sm:w-auto">
              <label htmlFor="admin-resource-status-filter" className="sr-only">Filter resource status</label>
              <select
                id="admin-resource-status-filter"
                value={resourceStatusFilter}
                onChange={(e) => setResourceStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#151A1D] border border-white/10 text-[#F5F5F5] text-xs rounded-xl p-2.5 font-semibold focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none"
              >
                <option value="" className="bg-[#101416] text-[#A5A8AA]">All Statuses</option>
                <option value="APPROVED" className="bg-[#101416]">Approved Only</option>
                <option value="PENDING" className="bg-[#101416]">Pending Only</option>
                <option value="REJECTED" className="bg-[#101416]">Rejected Only</option>
              </select>
            </div>
          </div>

          {resourcesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#DFFF00] animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-xs text-[#A5A8AA] py-12 text-center bg-[#151A1D]/40 rounded-xl border border-white/5">No resources found matching filter.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#151A1D] border-b border-white/10 text-[#A5A8AA]">
                      <th className="p-3.5 font-bold uppercase tracking-wider">Title / Subject</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Uploader</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Type / Course</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Status</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {resources.map((r) => (
                      <tr key={r._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 max-w-xs">
                          <p className="font-bold text-[#F5F5F5] break-words line-clamp-1">{r.title}</p>
                          <p className="text-[11px] text-[#DFFF00] font-semibold mt-0.5">{r.subject}</p>
                        </td>
                        <td className="p-3.5 text-[#A5A8AA]">
                          <p className="font-semibold text-[#F5F5F5] truncate max-w-[140px]">{r.uploadedBy?.name || 'Student'}</p>
                          <p className="text-[10px] text-[#72777A] truncate max-w-[140px]">{r.uploadedBy?.email}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#F5F5F5]">{r.resourceType}</span>
                          <p className="text-[10px] text-[#A5A8AA]">Sem {r.semester} • {r.course}</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              r.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                : r.status === 'REJECTED'
                                ? 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/25'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {r.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleResourceStatusChange(r._id, 'APPROVED')}
                              className="px-2.5 py-1 bg-[#DFFF00] text-[#050708] rounded-lg text-xs font-bold hover:bg-[#CFFF00] transition-colors cursor-pointer"
                              aria-label={`Approve ${r.title}`}
                            >
                              Approve
                            </button>
                          )}
                          {r.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleResourceStatusChange(r._id, 'REJECTED')}
                              className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer"
                              aria-label={`Reject ${r.title}`}
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteResourceId(r._id)}
                            className="px-2.5 py-1 bg-[#FF5C5C]/10 text-[#FF5C5C] border border-[#FF5C5C]/30 rounded-lg text-xs font-semibold hover:bg-[#FF5C5C]/20 transition-colors cursor-pointer"
                            aria-label={`Delete ${r.title}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden flex flex-col space-y-3">
                {resources.map((r) => (
                  <div key={r._id} className="bg-[#151A1D] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#F5F5F5] text-xs leading-snug break-words">{r.title}</h4>
                        <p className="text-[11px] text-[#DFFF00] font-semibold">{r.subject}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 border ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : r.status === 'REJECTED'
                            ? 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/25'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[#A5A8AA] bg-[#101416] p-2.5 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[#72777A]">Type:</span> {r.resourceType}
                      </div>
                      <div>
                        <span className="text-[#72777A]">Sem/Course:</span> {r.semester} • {r.course}
                      </div>
                      <div className="col-span-2 truncate">
                        <span className="text-[#72777A]">Uploaded by:</span> {r.uploadedBy?.name || 'Student'} ({r.uploadedBy?.email || 'N/A'})
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-white/5">
                      {r.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleResourceStatusChange(r._id, 'APPROVED')}
                          className="px-3 py-1 bg-[#DFFF00] text-[#050708] rounded-lg text-xs font-bold hover:bg-[#CFFF00] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleResourceStatusChange(r._id, 'REJECTED')}
                          className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteResourceId(r._id)}
                        className="px-3 py-1 bg-[#FF5C5C]/10 text-[#FF5C5C] border border-[#FF5C5C]/30 rounded-lg text-xs font-semibold hover:bg-[#FF5C5C]/20 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* USER REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="text-base sm:text-lg font-extrabold text-[#F5F5F5] tracking-tight">Reported Content Moderation</h3>
            <div className="w-full sm:w-auto">
              <label htmlFor="admin-report-status-filter" className="sr-only">Filter report status</label>
              <select
                id="admin-report-status-filter"
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#151A1D] border border-white/10 text-[#F5F5F5] text-xs rounded-xl p-2.5 font-semibold focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none"
              >
                <option value="" className="bg-[#101416] text-[#A5A8AA]">All Statuses</option>
                <option value="PENDING" className="bg-[#101416]">Pending Only</option>
                <option value="RESOLVED" className="bg-[#101416]">Resolved Only</option>
                <option value="DISMISSED" className="bg-[#101416]">Dismissed Only</option>
              </select>
            </div>
          </div>

          {reportsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#DFFF00] animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <p className="text-xs text-[#A5A8AA] py-12 text-center bg-[#151A1D]/40 rounded-xl border border-white/5">No reports found matching filter.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#151A1D] border-b border-white/10 text-[#A5A8AA]">
                      <th className="p-3.5 font-bold uppercase tracking-wider">Reported Resource</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Reason</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Reported By</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Status</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reports.map((rep) => (
                      <tr key={rep._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 max-w-xs">
                          <p className="font-bold text-[#F5F5F5] break-words line-clamp-1">{rep.resource?.title || 'Deleted Resource'}</p>
                          <p className="text-[10px] text-[#A5A8AA]">{rep.resource?.subject}</p>
                        </td>
                        <td className="p-3.5 text-[#F5F5F5] max-w-xs break-words">{rep.reason}</td>
                        <td className="p-3.5 text-[#A5A8AA]">
                          <p className="font-semibold text-[#F5F5F5] truncate max-w-[140px]">{rep.reportedBy?.name || 'Student'}</p>
                          <p className="text-[10px] text-[#72777A] truncate max-w-[140px]">{rep.reportedBy?.email}</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              rep.status === 'RESOLVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                : rep.status === 'DISMISSED'
                                ? 'bg-white/5 text-[#A5A8AA] border-white/10'
                                : 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/25'
                            }`}
                          >
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {rep.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleReportStatusChange(rep._id, 'RESOLVED')}
                              className="px-2.5 py-1 bg-[#DFFF00] text-[#050708] rounded-lg text-xs font-bold hover:bg-[#CFFF00] transition-colors cursor-pointer"
                              aria-label="Resolve report"
                            >
                              Resolve
                            </button>
                          )}
                          {rep.status !== 'DISMISSED' && (
                            <button
                              onClick={() => handleReportStatusChange(rep._id, 'DISMISSED')}
                              className="px-2.5 py-1 bg-[#151A1D] border border-white/10 text-[#A5A8AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              aria-label="Dismiss report"
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

              {/* Mobile Stacked Card View */}
              <div className="md:hidden flex flex-col space-y-3">
                {reports.map((rep) => (
                  <div key={rep._id} className="bg-[#151A1D] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#F5F5F5] text-xs leading-snug break-words">{rep.resource?.title || 'Deleted Resource'}</h4>
                        <p className="text-[10px] text-[#A5A8AA]">{rep.resource?.subject}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 border ${
                          rep.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : rep.status === 'DISMISSED'
                            ? 'bg-white/5 text-[#A5A8AA] border-white/10'
                            : 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/25'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>

                    <div className="bg-[#101416] p-3 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                      <p className="text-[10px] font-bold text-[#72777A] uppercase tracking-wider">Report Reason:</p>
                      <p className="text-[#F5F5F5] break-words leading-relaxed">{rep.reason}</p>
                      <div className="pt-2 border-t border-white/5 text-[10px] text-[#72777A] truncate">
                        Reported by: <span className="text-[#A5A8AA]">{rep.reportedBy?.name || 'Student'} ({rep.reportedBy?.email || 'N/A'})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-white/5">
                      {rep.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleReportStatusChange(rep._id, 'RESOLVED')}
                          className="px-3 py-1 bg-[#DFFF00] text-[#050708] rounded-lg text-xs font-bold hover:bg-[#CFFF00] transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                      {rep.status !== 'DISMISSED' && (
                        <button
                          onClick={() => handleReportStatusChange(rep._id, 'DISMISSED')}
                          className="px-3 py-1 bg-[#101416] border border-white/10 text-[#A5A8AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* USER DIRECTORY TAB */}
      {activeTab === 'users' && (
        <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6">
          <h3 className="text-base sm:text-lg font-extrabold text-[#F5F5F5] tracking-tight mb-6">Registered Students Directory</h3>

          {usersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#DFFF00] animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-xs text-[#A5A8AA] py-12 text-center bg-[#151A1D]/40 rounded-xl border border-white/5">No users registered.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#151A1D] border-b border-white/10 text-[#A5A8AA]">
                      <th className="p-3.5 font-bold uppercase tracking-wider">User</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">College / Course</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Role</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Contribution Points</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-[#F5F5F5]">{u.name}</p>
                          <p className="text-[10px] text-[#72777A] truncate max-w-[180px]">{u.email}</p>
                        </td>
                        <td className="p-3.5 text-[#A5A8AA]">
                          <p className="font-semibold text-[#F5F5F5]">{u.college || 'N/A'}</p>
                          <p className="text-[10px] text-[#72777A]">{u.course} (Sem {u.semester || 'N/A'})</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                                : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 font-extrabold text-[#DFFF00]">⭐ {u.contributionPoints || 0} pts</td>
                        <td className="p-3.5 text-[#72777A]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden flex flex-col space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="bg-[#151A1D] border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#F5F5F5] text-xs">{u.name}</h4>
                        <p className="text-[10px] text-[#72777A] break-all">{u.email}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 border ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[#A5A8AA] bg-[#101416] p-2.5 rounded-lg border border-white/5">
                      <div>
                        <span className="text-[#72777A]">College:</span> {u.college || 'N/A'}
                      </div>
                      <div>
                        <span className="text-[#72777A]">Course/Sem:</span> {u.course || 'N/A'} (Sem {u.semester || 'N/A'})
                      </div>
                      <div>
                        <span className="text-[#72777A]">Points:</span> <span className="text-[#DFFF00] font-bold">⭐ {u.contributionPoints || 0}</span>
                      </div>
                      <div>
                        <span className="text-[#72777A]">Joined:</span> {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
