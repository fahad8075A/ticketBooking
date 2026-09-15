import React, { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Compass,
  Plane,
  Train,
  Ticket,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const iconMap = {
  plane: Plane,
  train: Train,
  event: Ticket,
  default: Compass,
};

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    tagline: "",
    badge: "",
    imageUrl: "",
    iconKey: "default",
  });

  const getAuthToken = () =>
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      code: "",
      name: "",
      tagline: "",
      badge: "",
      imageUrl: "",
      iconKey: "default",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id || cat.id);
    setFormData({
      code: (cat.code || cat.slug || "").toLowerCase(),
      name: cat.label || cat.name || cat.title || "",
      tagline: cat.tagline || cat.desc || cat.description || "",
      badge: cat.badge || "",
      imageUrl: cat.imageUrl || cat.image || "",
      iconKey: cat.iconKey || cat.iconName || "default",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ text: "", type: "" });

    try {
      const url = editingId
        ? `${API_BASE_URL}/categories/${editingId}`
        : `${API_BASE_URL}/categories`;
      const method = editingId ? "PUT" : "POST";
      const token = getAuthToken();

      // Normalizing payload to satisfy Mongoose schema rules
      const cleanCode = formData.code.trim().toLowerCase();
      const displayName = formData.name.trim();

      const payload = {
        ...formData,
        code: cleanCode,
        slug: cleanCode,
        label: displayName,       // Resolves 'label is required' validation error
        name: displayName,
        title: displayName,
        imageUrl: formData.imageUrl.trim(),
        image: formData.imageUrl.trim(),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to save category");
      }

      setFeedback({
        text: `Category ${editingId ? "updated" : "created"} successfully!`,
        type: "success",
      });
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      setFeedback({ text: "Category deleted", type: "success" });
    } catch (err) {
      setFeedback({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200">
              <Tags className="w-5 h-5 text-sky-600" />
            </div>
            Category Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure homepage category cards, custom slugs, icons, and hero tags.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow-sky-500/25 shadow-sky-500/15 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Feedback banner */}
      {feedback.text && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-xs ${
            feedback.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
          <p className="text-xs font-medium text-slate-500">Loading category entries...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
          No categories found. Click "Add Category" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const id = cat._id || cat.id || cat.code;
            const title = cat.label || cat.name || cat.title || cat.code;
            const slug = (cat.code || cat.slug || "").toLowerCase();
            const IconComponent = iconMap[cat.iconKey] || iconMap.default;

            return (
              <div
                key={id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Hero Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={
                      cat.imageUrl ||
                      cat.image ||
                      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

                  {/* Top Badge */}
                  {cat.badge && (
                    <span className="absolute top-3 right-3 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {cat.badge}
                    </span>
                  )}

                  {/* Slug Pill */}
                  <span className="absolute bottom-3 left-4 font-mono text-[11px] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-sky-700 font-semibold border border-sky-200/70 shadow-2xs">
                    /{slug}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.tagline || cat.desc || cat.description || "No description set"}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Icon: <span className="text-slate-600">{cat.iconKey || "default"}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(id, title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                  Code / Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toLowerCase() })
                  }
                  placeholder="e.g. flights, trains, events"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Global Flights"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Global Destinations At Your Fingertips."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. MOST POPULAR"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                    Icon Key
                  </label>
                  <select
                    value={formData.iconKey}
                    onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                  >
                    <option value="plane">Plane</option>
                    <option value="train">Train</option>
                    <option value="event">Event</option>
                    <option value="default">Default Ticket</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 uppercase font-bold tracking-wider mb-1 text-[11px]">
                  Image URL / Asset Key
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="e.g. train.jpg, events.jpg or https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;