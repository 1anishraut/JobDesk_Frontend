"use client";
import { ToastContainer } from "react-toastify";
import AdminNavbar from "./Home/AdminNavbar";
import store from "./Store/appStore";
import { Provider } from "react-redux";

export default function ProviderWrapper({ children }) {
  return (
    <Provider store={store}>
      <div className="flex">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* ✅ Sticky Sidebar Navbar */}
        <div className="sticky top-0 h-screen">
          <AdminNavbar />
        </div>

        {/* ✅ Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto h-screen">{children}</main>
      </div>
    </Provider>
  );
}
