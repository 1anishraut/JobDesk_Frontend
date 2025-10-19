"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";

const Home = dynamic(() => import("./Home/page.js"), {
  ssr: false,
});

export default function Page() {
  

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-900 text-white">
      {/* Left Side - Branding */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="text-4xl font-bold tracking-wide mb-4 text-center">
          <span className="text-[#00E0FF]">Job</span>Desk
        </div>
        <p className="text-gray-300 text-center text-lg">
          Keep track of every task, stay organized, and never miss a deadline
          again
        </p>
      </div>

      {/* Right Side - Home Component */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <Home />
      </div>
    </div>
  );
}
