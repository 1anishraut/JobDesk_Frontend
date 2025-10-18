"use client";

import { useState, useMemo } from "react";
import {
  FaPlus,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addTask } from "../Store/taskSlice";
import { BASE_URL } from "../Utils/URL";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    taskName: "",
    taskDueDate: "",
    companyName: "",
    contact: "",
    emailId: "",
    taskDescription: "",
    taskPrice: "",
    taskAdvencePaid: "",
    taskStatus: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const amountLeft = useMemo(() => {
    const price = Number(form.taskPrice) || 0;
    const paid = Number(form.taskAdvencePaid) || 0;
    return price - paid >= 0 ? price - paid : 0;
  }, [form.taskPrice, form.taskAdvencePaid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.taskName.trim()) newErrors.taskName = "Project name is required";
    if (!form.taskDueDate) newErrors.taskDueDate = "Due date is required";
    if (!form.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!form.contact.trim()) newErrors.contact = "Contact is required";
    if (!form.emailId.trim()) newErrors.emailId = "Email is required";
    if (!form.taskDescription.trim())
      newErrors.taskDescription = "Description is required";
    if (!form.taskPrice) newErrors.taskPrice = "Price is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/task`, form, {
        withCredentials: true,
      });
      dispatch(addTask(res.data.task || res.data));

      // Reset form
      setForm({
        taskName: "",
        taskDueDate: "",
        companyName: "",
        contact: "",
        emailId: "",
        taskDescription: "",
        taskPrice: "",
        taskAdvencePaid: "",
        taskStatus: "Pending",
      });

      toast.success("Task added successfully!");

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    router.back();
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2  text-white">
            <FaPlus className="text-blue-400" /> Add New Project
          </h3>
          <button
            onClick={handleClose}
            className=" text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="taskName"
              value={form.taskName}
              onChange={handleChange}
              placeholder=""
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.taskName && (
              <p className="text-red-500 text-xs mt-1">{errors.taskName}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm text-gray-300">
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                type="date"
                name="taskDueDate"
                value={form.taskDueDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-yellow-400" />
            </div>
            {errors.taskDueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.taskDueDate}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="text-sm text-gray-300">
              Company <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder=""
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              />
              <FaBuilding className="absolute right-3 top-3 text-indigo-400" />
            </div>
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Contact + Email in one row */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">
                Contact <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                />
                <FaPhone className="absolute right-3 top-3 text-purple-400" />
              </div>
              {errors.contact && (
                <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  name="emailId"
                  value={form.emailId}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                />
                <FaEnvelope className="absolute right-3 top-3 text-pink-400" />
              </div>
              {errors.emailId && (
                <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="taskDescription"
              value={form.taskDescription}
              onChange={handleChange}
              rows="3"
              placeholder="Description about the task"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.taskDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.taskDescription}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm text-gray-300">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                name="taskPrice"
                value={form.taskPrice}
                onChange={handleChange}
                type="number"
                min="0"
                placeholder=""
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              />
              <FaMoneyBillWave className="absolute right-3 top-3 text-green-400" />
            </div>
            {errors.taskPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.taskPrice}</p>
            )}
          </div>

          {/* Advance Paid */}
          <div>
            <label className="text-sm text-gray-300">Advance Paid (₹)</label>
            <input
              name="taskAdvencePaid"
              value={form.taskAdvencePaid}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder=""
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-gray-400">Amount left:</span>
              <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-white font-semibold">
                ₹{amountLeft}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                name="taskStatus"
                value={form.taskStatus}
                onChange={handleChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${
                  loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaPlus /> Create
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
