import React from "react";

export default function GenerateSlide({
  handleFileChange,
  images,
  timeSlide,
  setTimeSlide,
}) {
  return (
    <div className="flex justify-center items-center mb-6">
      <label className="cursor-pointer inline-block py-2 px-4 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90">
        Chọn ảnh
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <p className="ml-4 text-gray-600 font-medium">
        <span className="text-primary">Selected files:</span> {images.length}
      </p>
      <div className="flex items-center ml-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
        <label className="text-gray-700 font-medium mr-3">Time (ms):</label>
        <input
          type="number"
          value={timeSlide}
          onChange={(e) => setTimeSlide(Number(e.target.value))}
          className="w-28 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
          min="100"
          step="100"
        />
      </div>
    </div>
  );
}
