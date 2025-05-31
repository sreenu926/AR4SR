"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResearchAnalysis() {
  // Renamed the component
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const summaryParam = searchParams.get("summary");
      const titleParam = searchParams.get("title");
      const urlParam = searchParams.get("url");

      if (summaryParam) {
        const formattedSummary = summaryParam.replace(/\n/g, "<br />");
        setSummary(formattedSummary);
        setTitle(titleParam);
        console.log("Title: ", titleParam);
        setUrl(urlParam);
        console.log("URL: ", urlParam);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      {" "}
      {/* Added min-h-screen */}
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Analyzing research paper...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 bg-white p-2 rounded-lg text-xl">
          Failed to analyze the PDF. Please try again.
        </p>
      ) : (
        <div className="max-w-2xl p-5 bg-white rounded-lg shadow-lg">
          {title && url && (
            <h2 className="text-xl font-bold mb-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {title}
              </a>
            </h2>
          )}
          <h3 className="text-lg font-semibold mb-2">Research Paper Summary</h3>
          <p
            className="text-gray-700 text-justify"
            dangerouslySetInnerHTML={{ __html: summary }}
          ></p>
        </div>
      )}
    </div>
  );
}

export default ResearchAnalysis; // Renamed the export
