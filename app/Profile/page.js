"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../Utils/URL";
import { addUser, removeUser } from "../Store/userSlice";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profession: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Update profile
  const handleUpdate = async () => {
    if (!user?._id) return toast.error("User ID missing, please login again");

    try {
      const res = await axios.patch(
        `${BASE_URL}/updateProfile/${user._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      toast.success("Profile updated successfully");
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteProfile/${user._id}`, {
        withCredentials: true,
      });
      dispatch(removeUser());
      toast.success("Account deleted");
      router.push("/");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Update Profile
        </h1>

        <div className="flex flex-col gap-5">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Profession */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">
              Profession <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Enter profession"
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-gray-300 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none transition"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
