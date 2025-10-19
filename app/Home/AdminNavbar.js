"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { BASE_URL } from "../Utils/URL";
import { removeUser } from "../Store/userSlice";
import { FiLogOut, FiUser, FiSettings, FiHome } from "react-icons/fi";

const AdminNavbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Logged out successfully");
      dispatch(removeUser());
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className="flex flex-col justify-between h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white sticky top-0">
      {/* Logo */}
      <div className="text-2xl font-bold mb-6 text-center hidden md:flex">
        <span className="text-[#00E0FF]">Job</span>Desk
      </div>
      <div className="text-2xl font-bold mb-6 text-center md:hidden">
        <span className="text-[#00E0FF]">J</span>D
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-300 hidden sm:block">
          Welcome,
          <br />
          <span className="font-semibold">
            {user?.firstName} {user?.lastName}
          </span>
        </p>

        {/* Menu */}
        <div className="flex flex-col w-full gap-3 mt-4">
          <button
            onClick={() => router.push("/Dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700"
          >
            <FiHome /> <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => router.push("/Profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700"
          >
            <FiUser /> <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 cursor-not-allowed"
          >
            <FiSettings /> <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-600 text-red-400"
          >
            <FiLogOut /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
