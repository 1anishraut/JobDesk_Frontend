"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setTasks } from "../Store/taskSlice";
import { BASE_URL } from "../Utils/URL";
import { useRouter } from "next/navigation";
import EditTask from "./EditTask";
import { toast } from "react-toastify";

const AllTasks = ({ tasks }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  //  Mark as completed
  const handleMarkComplete = async (taskId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/task/${taskId}/status`,
        { taskStatus: "Completed" },
        { withCredentials: true }
      );

      toast.success("Task Updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      // console.log(" Status updated:", res.data.message);
    } catch (error) {
      console.error(" Error updating task status:", error);
      // alert("Failed to update task status. Try again!");
      toast.error("Failed to update task. Try again!");
    }
  };

  //  Delete Task
  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`${BASE_URL}/task/${taskId}`, {
        withCredentials: true,
      });

      toast.success("Task Deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      // console.log("Task deleted successfully");
    } catch (error) {
      // console.error(" Error deleting task:", error);
      toast.error("Failed to delete task. Try again!");
      // alert("Failed to delete task. Try again!");
    }
  };

  const [taskId, setTaskId] = useState();

  //  Edit Task
  const handleEdit = (taskId) => {
    setTaskId(taskId);

    // Scroll page to top when edit is clicked
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!tasks?.length)
    return <p className="text-center text-gray-400">No tasks available.</p>;

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all border border-gray-700 hover:border-blue-500"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{task.taskName}</h2>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  task.taskStatus === "Completed"
                    ? "bg-green-600"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {task.taskStatus}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-3 text-sm">{task.taskDescription}</p>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <FaBuilding className="text-blue-400" />
                {task.companyName}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-400" />
                Due: {new Date(task.taskDueDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-400" />
                Price: ₹{task.taskPrice}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-orange-400" />
                Paid: ₹{task.taskAdvencePaid} | Left: ₹{task.taskAmoutLeft}
              </p>
              <p className="flex items-center gap-2">
                <FaCheckCircle className="text-purple-400" />
                Contact: {task.contact}
              </p>
              <p className="text-gray-400 text-sm italic">{task.emailId}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex justify-between items-center">
              <div className="flex gap-4 md:gap-2">
                <button
                  onClick={() => handleEdit(task._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
                >
                  <FaEdit /> <span className="md:block hidden">Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
                >
                  <FaTrash /> <span className="md:block hidden">Delete</span>
                </button>
              </div>

              <button
                onClick={() => handleMarkComplete(task._id)}
                disabled={task.taskStatus === "Completed"}
                className={`ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  task.taskStatus === "Completed"
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {task.taskStatus === "Completed" ? "Done" : "Mark as Completed"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {taskId && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-start justify-center bg-gray-900/70 backdrop-blur-sm overflow-auto p-4">
          <EditTask id={taskId} onClose={() => setTaskId(null)} />
        </div>
      )}
    </div>
  );
};

export default AllTasks;
