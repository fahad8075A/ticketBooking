import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  X,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalUsers: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("authToken");
  const userEmail = localStorage.getItem("userEmail");

  const fetchUsers = async (pageNumber = page, search = searchTerm) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pageNumber,
        limit: 10,
        search,
      }).toString();

      const response = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-email": userEmail || "",
        },
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to load users");
      }

      setUsers(resData.data?.users || []);
      setPagination(resData.data?.pagination || { totalPages: 1, totalUsers: 0 });
    } catch (err) {
      setFeedbackMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, searchTerm);
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      setActionLoading(userId);
      setFeedbackMessage({ text: "", type: "" });

      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-user-email": userEmail || "",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setFeedbackMessage({
        text: `User role changed to ${newRole.toUpperCase()} successfully`,
        type: "success",
      });
    } catch (err) {
      setFeedbackMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId, targetEmail) => {
    if (targetEmail === userEmail) {
      setFeedbackMessage({
        text: "You cannot delete your own active administrator account.",
        type: "error",
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${targetEmail}?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      setFeedbackMessage({ text: "", type: "" });

      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-email": userEmail || "",
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setFeedbackMessage({
        text: "User account removed successfully",
        type: "success",
      });
    } catch (err) {
      setFeedbackMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 sm:p-8 font-sans overflow-hidden">
      {/* Dynamic Floating Background Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div 
        className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "7s" }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-sky-100 shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/60 text-sky-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: "12s" }} />
              Admin Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <Users className="w-8 h-8 text-sky-500" /> User Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage profiles, elevate administrator privileges, and oversee platform access.
            </p>
          </div>

          <button
            onClick={() => fetchUsers(page, searchTerm)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-sky-200 hover:border-sky-300 text-sky-700 hover:text-sky-900 rounded-2xl text-xs font-semibold shadow-sm hover:shadow transition-all duration-300 transform active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-sky-500 transition-transform duration-500 group-hover:rotate-180 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh List
          </button>
        </div>

        {/* Feedback Alert Message */}
        {feedbackMessage.text && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
              feedbackMessage.type === "error"
                ? "bg-rose-50/90 border-rose-200 text-rose-700"
                : "bg-emerald-50/90 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedbackMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage({ text: "", type: "" })}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter and Overview Card */}
        <div className="bg-white/80 backdrop-blur-md border border-sky-100 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-sky-50/50 hover:bg-sky-50/80 focus:bg-white border border-sky-100 focus:border-sky-400 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none transition duration-200 shadow-inner"
            />
          </form>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 self-end sm:self-center bg-sky-50/70 border border-sky-100 px-3.5 py-1.5 rounded-full">
            <span>Total Registered Users:</span>
            <span className="text-sky-600 font-bold bg-white px-2 py-0.5 rounded-full shadow-xs border border-sky-100">
              {pagination.totalUsers}
            </span>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-gradient-to-r from-sky-50 via-sky-50/60 to-white uppercase text-[10px] tracking-wider text-slate-400 font-bold border-b border-sky-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-400">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                      </div>
                      <p className="mt-3 font-medium text-sky-800">Fetching records...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-400 mx-auto flex items-center justify-center mb-2">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-600">No matching users found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Try refining your search keyword.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => {
                    const isCurrentAdmin = u.email === userEmail;
                    const isBusy = actionLoading === u._id;

                    return (
                      <tr
                        key={u._id}
                        style={{ animationDelay: `${idx * 40}ms` }}
                        className="group hover:bg-sky-50/40 transition-all duration-200 animate-in fade-in"
                      >
                        {/* Profile Info */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm uppercase shrink-0 transition-transform group-hover:scale-105">
                            {(u.name || u.email || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              {u.name || "Default Account"}
                              {isCurrentAdmin && (
                                <span className="text-[9px] bg-sky-100 text-sky-700 border border-sky-200 px-1.5 py-0.2 rounded font-semibold">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                          </div>
                        </td>

                        {/* User Role Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all shadow-2xs ${
                              u.role === "admin"
                                ? "bg-sky-100/90 text-sky-700 border border-sky-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200/80"
                            }`}
                          >
                            {u.role === "admin" ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                            ) : (
                              <Shield className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {u.role || "user"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4 text-slate-500 font-medium text-[11px]">
                          {new Date(u.createdAt || Date.now()).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Interactive Buttons */}
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            disabled={isBusy || isCurrentAdmin}
                            onClick={() => handleRoleToggle(u._id, u.role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition duration-200 border cursor-pointer active:scale-95 ${
                              u.role === "admin"
                                ? "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 shadow-2xs"
                                : "bg-sky-500 hover:bg-sky-600 text-white border-sky-500 shadow-sm hover:shadow"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {isBusy ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin inline mx-2" />
                            ) : u.role === "admin" ? (
                              "Demote to User"
                            ) : (
                              "Make Admin"
                            )}
                          </button>

                          <button
                            disabled={isBusy || isCurrentAdmin}
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer inline-flex items-center active:scale-90"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500 bg-sky-50/30">
            <span>
              Page <strong className="text-slate-800">{page}</strong> of{" "}
              <strong className="text-slate-800">{pagination.totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-xl border border-sky-100 bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-700 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="p-1.5 rounded-xl border border-sky-100 bg-white hover:bg-sky-50 text-slate-600 hover:text-sky-700 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;