"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addTask, setTasks } from "../Store/taskSlice";
import { BASE_URL } from "../Utils/URL";
import AllTasks from "./AllTasks";
import { ToastContainer } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [countdown, setCountdown] = useState(4);
  const [user, setUser] = useState(false);

  // Check user token
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      setUser(true);
    } else {
      const interval = setInterval(
        () => setCountdown((prev) => prev - 1),
        1000
      );
      const timeout = setTimeout(() => router.push("/"), 4000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [router]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks`, {
        withCredentials: true,
      });
      dispatch(addTask(res.data));
      setFilteredTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    // error here 
    let updated = [...tasks];

    if (filterStatus !== "All") {
      updated = updated.filter((task) => task.taskStatus === filterStatus);
    }

    if (sortOrder === "Newest") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredTasks(updated);
  }, [filterStatus, sortOrder, tasks]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gray-900">
        <h1 className="text-2xl font-bold mb-2">Please login</h1>
        <p>Redirecting to login in {countdown} seconds...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/AddTask")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            + Add New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option>Newest</option>
          <option>Oldest</option>
        </select>
      </div>

      {/* Task List */}
      <AllTasks tasks={filteredTasks} />
    </div>
  );
};

export default Page;
