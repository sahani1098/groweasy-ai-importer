"use client";

import { useState } from "react";
import Papa from "papaparse";
import UploadBox from "@/components/UploadBox";
import PreviewTable from "@/components/PreviewTable";
import ResultTable from "@/components/ResultTable";
import api from "@/services/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [crmData, setCrmData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewData(results.data as Record<string, string>[]);
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);

      setCrmData(response.data.records);
    } catch (error) {
      console.error(error);
      alert("Import failed");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-5xl font-extrabold text-gray-800">
          GrowEasy AI CSV Importer
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          Upload any CSV and let AI automatically map it into CRM records.
        </p>

        <UploadBox onFileSelect={handleFileSelect} />

        <PreviewTable data={previewData} />

        {previewData.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={handleImport}
              disabled={loading}
              className="bg-gradient-to-r
    from-blue-600
    to-indigo-600
    text-white
    px-8
    py-3
    rounded-xl
    font-semibold
    shadow-lg
    hover:scale-105
    hover:shadow-xl
    transition-all
    duration-300
    disabled:opacity-50
    disabled:cursor-not-allowed"
            >
              {loading ? "Importing..." : "Confirm Import"}
            </button>
          </div>
        )}

        <ResultTable data={crmData} />

      </div>
    </main>
  );
}