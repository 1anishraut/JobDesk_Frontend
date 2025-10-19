"use client";

import { useEffect, useState } from "react";
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
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    profession: user?.profession || "",
  });
  useEffect(() => {
    
    const hasToken = document.cookie.includes("token=");

    
    if (!hasToken) {
      dispatch(removeUser());
    }
  }, []);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

                                                                                      // Update API
  const handleUpdate = async () => {
    if (!user?._id) {
      toast.error("User ID missing, please login again");
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/updateProfile/${user._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res.data)); 
      toast.success("Profile Update Sucessful");
      setTimeout(()=>{
        router.back();
      },2000)
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

                                                                                      //Delete API
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
    <div className="min-h-screen flex items-center justify-center">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Update Profile
        </h1>

        <div className="flex flex-col gap-4">
          {["firstName", "lastName", "age", "profession"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-300 mb-1 capitalize" htmlFor={field}>
                {field}
              </label>
              <input
                id={field}
                type={field === "age" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-400"
                placeholder=""
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
