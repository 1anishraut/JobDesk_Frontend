"use client";

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../Utils/URL";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Store/userSlice";

export default function AuthPage() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [error, setError] = useState();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (formData) => {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      emailId: formData.get("emailId"),
      password: formData.get("password"),
    };

    let endpoint = "";
    if (mode === "signup") endpoint = "/signUp";
    if (mode === "login") endpoint = "/login";
    if (mode === "forgot") endpoint = "/forgotPassword";

    try {
      const res = await axios.post(BASE_URL + `${endpoint}`, data, {
        withCredentials: true,
      });

      // console.log(res.data);

      if (mode !== "forgot") {
        dispatch(addUser(res.data.data || res.data.user || res.data));
        // alert(res.data.message );
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("../Dashboard");
        }, 1000);
      } else {
       
        toast.success("Password reset successful! Please login.");
        setForm({ firstName: "", lastName: "", emailId: "", password: "" });
        setMode("login"); 
      }
    } catch (error) {
      toast.error(error?.response?.data);
      setError(error.response?.data);
    }
  };

  // console.log(user);

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-900 text-white px-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Create Account"
            : "Reset Password"}
        </h1>

        <form action={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                defaultValue={form.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 focus:outline-none"
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                defaultValue={form.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 focus:outline-none"
                required
              />
            </>
          )}

          <input
            name="emailId"
            type="email"
            placeholder="Email"
            defaultValue={form.emailId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder={mode === "forgot" ? "Enter new password" : "Password"}
            defaultValue={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

                                                                                        {/* Display  */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold"
          >
            {mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : "Reset Password"}
          </button>
        </form>

                                                                                      {/* Navigation Links */}
        <div className="mt-6 text-center space-y-2 text-sm">
          {mode !== "login" && (
            <p>
              Already have an account?
              <button
                onClick={() => setMode("login")}
                className="text-blue-400 underline"
              >
                Login
              </button>
            </p>
          )}

          {mode !== "signup" && (
            <p>
              New user?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-400 underline"
              >
                Create Account
              </button>
            </p>
          )}

          {mode !== "forgot" && (
            <p>
              Forgot password?{" "}
              <button
                onClick={() => setMode("forgot")}
                className="text-blue-400 underline"
              >
                Reset
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
