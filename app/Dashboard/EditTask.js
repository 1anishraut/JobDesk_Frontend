"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Utils/URL";
import {  FaTimes } from "react-icons/fa";

export default function EditTask({ id }) {
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch task by ID
  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/task/${id}`, {
          withCredentials: true,
        });

        if (res.data.task) {
          setForm(res.data.task);
        } else {
          toast.error("Task not found");
          router.push("/Dashboard");
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        toast.error("Failed to load task");
        router.push("/Dashboard");
      }
    };

    fetchTask();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const amountLeft = useMemo(() => {
    const price = Number(form.taskPrice) || 0;
    const paid = Number(form.taskAdvencePaid) || 0;
    return Math.max(price - paid, 0);
  }, [form.taskPrice, form.taskAdvencePaid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.taskName.trim()) newErrors.taskName = "Project name required";
    if (!form.taskDueDate) newErrors.taskDueDate = "Due date required";
    if (!form.companyName.trim()) newErrors.companyName = "Company required";
    if (!form.contact.trim()) newErrors.contact = "Contact required";
    if (!form.emailId.trim()) newErrors.emailId = "Email required";
    if (!form.taskDescription.trim())
      newErrors.taskDescription = "Description required";
    if (!form.taskPrice) newErrors.taskPrice = "Price required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`${BASE_URL}/task/${id}`, form, {
        withCredentials: true,
      });
      toast.success("Task updated successfully!");
       setTimeout(() => {
         window.location.reload();
       }, 2000);
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };
 const handleClose = () => {
   window.location.reload(); // reload page on close
 };
  return (
    <div className=" lg:p-6 w-full lg:max-w-3xl absolute top-0 left-1/2 transform -translate-x-1/2 ">
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">

        <h3 className="text-2xl font-bold flex items-center gap-2  text-white">
          <FaPlus className="text-blue-400" /> Edit Task
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
              placeholder="Website redesign"
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
            <input
              type="date"
              name="taskDueDate"
              value={form.taskDueDate?.split("T")[0]}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.taskDueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.taskDueDate}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="text-sm text-gray-300">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="TechNova Solutions"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="text-sm text-gray-300">
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="+919876543210"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="emailId"
              value={form.emailId}
              onChange={handleChange}
              placeholder="client@company.com"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            {errors.emailId && (
              <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
            )}
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
              placeholder="Short description about the task"
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
            <input
              name="taskPrice"
              value={form.taskPrice}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="1200"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
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
              placeholder="500"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
          </div>

          {/* Amount Left & Status */}
          <div className="md:col-span-2 flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-gray-400">Amount left:</span>
              <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-white font-semibold">
                ₹{amountLeft}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
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
                {loading ? "Saving..." : "Update Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
