import React from "react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 h-48 flex justify-center items-center mt-20 mx-1">
      <div className="space-y-2 text-center">
        <h1 className="text-white text-3xl">Welcom To My Blog Channel</h1>
        <p className="text-gray-300 text-sm">
          An amazing place where you can store and manage your blogs.
        </p>
      </div>
    </div>
  );
}
