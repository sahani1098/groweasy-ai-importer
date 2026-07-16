"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

export default function UploadBox({ onFileSelect }: UploadBoxProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    multiple: false,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-blue-500 bg-blue-50 shadow-xl scale-[1.02]"
          : "border-gray-300 bg-white hover:border-blue-500 hover:shadow-lg"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex justify-center mb-5">
        <div className="bg-blue-100 p-5 rounded-full">
          <UploadCloud className="h-12 w-12 text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Drag & Drop CSV File
      </h2>

      <p className="mt-3 text-gray-500 text-base">
        Drop your CSV here or click to browse
      </p>

      <p className="mt-2 text-sm text-gray-400">
        Supports Facebook Leads, Google Ads, Excel, CRM exports and more
      </p>

      <button
        type="button"
        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all"
      >
        Choose CSV File
      </button>
    </div>
  );
}