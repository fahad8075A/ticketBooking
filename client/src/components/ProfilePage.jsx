import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCamera, FaTrashAlt, FaPen, FaSignOutAlt } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Load existing or passed profile data
  const initialEmail = location.state?.email || "arun80@gmail.com";

  const [name, setName] = useState(() => {
    return localStorage.getItem("userName") || "Arun";
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("userEmail") || initialEmail;
  });

  const [avatar, setAvatar] = useState(() => {
    return (
      localStorage.getItem("userAvatar") ||
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop"
    );
  });

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Remove Image
  const handleRemoveImage = () => {
    setAvatar(
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"
    );
  };

  // Save to localStorage & redirect to HOME PAGE ("/")
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userAvatar", avatar);

    // Redirect to Home Page
    navigate("/");
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#a8a29e] flex items-center justify-center p-4 font-sans">
      {/* Profile Card Modal */}
      <div className="w-full max-w-[420px] bg-white rounded-[36px] shadow-2xl p-8 sm:p-10 flex flex-col items-center">
        {/* Profile Avatar with Border */}
        <div className="relative mb-3">
          <div className="w-28 h-28 rounded-full border-4 border-[#1e4b6d] overflow-hidden shadow-md">
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Name & Email Header */}
        <h2 className="text-xl font-bold tracking-wide text-gray-900 uppercase">
          {name || "USER"}
        </h2>
        <p className="text-gray-600 text-sm font-medium mt-0.5 mb-4">
          {email}
        </p>

        {/* Avatar Action Buttons (Upload & Delete) */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Photo"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaCamera className="text-xs" />
          </button>
          <button
            type="button"
            onClick={handleRemoveImage}
            title="Delete Photo"
            className="w-9 h-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
          >
            <FaTrashAlt className="text-xs" />
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleUpdateProfile} className="w-full space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              NAME
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#e8eef3] text-gray-800 text-sm font-medium px-4 py-3 rounded-2xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#1e4b6d] transition"
              />
              <FaPen className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#e8eef3] text-gray-800 text-sm font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1e4b6d] transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-[#bd7417] hover:bg-[#a66412] active:scale-[0.99] text-white font-semibold text-base py-3.5 rounded-2xl transition shadow-md cursor-pointer"
            >
              Update Profile
            </button>

            {/* Dedicated Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 active:scale-[0.99] font-semibold text-sm py-3 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaSignOutAlt className="text-xs" /> Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;