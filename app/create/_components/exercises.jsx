"use client";
import React, { useState, Suspense } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// function LogoTitle({ onHandleInputChange, formData }) {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <LogoTitleContent
//         onHandleInputChange={onHandleInputChange}
//         formData={formData}
//       />
//     </Suspense>
//   );
// }

// function LogoTitleContent({ onHandleInputChange, formData }) {
//   const searchParam = useSearchParams();
//   const [title, setTitle] = useState(searchParam?.get("title") ?? "");

//   const router = useRouter();

//   // State for PDF Upload
//   const [selectedFile, setSelectedFile] = useState(null);

//   // State for Research Paper Fetching
//   const [searchQuery, setSearchQuery] = useState("");
//   const [papers, setPapers] = useState([]);
//   const [selectedPaper, setSelectedPaper] = useState(null);

//   // Handle File Upload
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   // Analyze Uploaded PDF
//   const analyzePDF = async () => {
//     if (!selectedFile) {
//       alert("Please upload a PDF first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       // Navigate to the analyzing page
//       router.push("/create/analysis?loading=true");

//       const response = await fetch("/api/analyze-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to analyze PDF");

//       const data = await response.json();

//       // ✅ Redirect to summary page with result
//       router.push(
//         `/create/analysis?summary=${encodeURIComponent(data.summary)}`
//       );
//     } catch (error) {
//       console.error("Error analyzing PDF:", error);
//     }
//   };

//   // Fetch Papers from CORE API
//   const fetchPapers = async () => {
//     if (!searchQuery) {
//       alert("Please enter a search term.");
//       return;
//     }

//     try {
//       const response = await fetch(`/api/fetchPapers?query=${searchQuery}`);
//       const data = await response.json();
//       setPapers(data.papers || []);
//     } catch (error) {
//       console.error("Error fetching papers:", error);
//     }
//   };

//   // Analyze Selected Paper
//   const analyzeSelectedPaper = async () => {
//     if (!selectedPaper) {
//       alert("Please select a research paper first.");
//       return;
//     }

//     try {
//       // Navigate to the analyzing page
//       router.push("/create/analysis?loading=true");

//       // Make API call to your backend for paper analysis
//       const response = await fetch("/api/analyze-selected-paper", {
//         // Ensure this endpoint exists in your backend
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ paper: selectedPaper }), // Send the selected paper details
//       });

//       if (!response.ok) {
//         throw new Error("Failed to analyze selected paper");
//       }

//       const data = await response.json();

//       // Redirect to summary page with result
//       router.push(
//         `/create/analysis?summary=${encodeURIComponent(data.summary)}`
//       );
//     } catch (error) {
//       console.error("Error analyzing selected paper:", error);
//       alert("Failed to analyze the selected paper. Please try again.");
//       // Optionally, handle the error (e.g., show an error message)
//     }
//   };

//   return (
//     <div className="my-0 p-2 md:p-5 border rounded-lg shadow-lg bg-white">
//       <div className="mb-10">
//         <HeadingDescription
//           title="Research Paper Analysis"
//           description="Upload a research paper or fetch relevant papers from CORE API for analysis."
//         />
//       </div>

//       {/* PDF Upload Section */}
//       <div className="mb-5">
//         <label className="block text-md md:text-lg text-center md:text-left font-semibold">
//           Upload Research Paper (PDF)
//         </label>
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="mt-2 p-3 border text-sm rounded-lg w-full"
//         />

//         <div className="flex justify-center mb-10">
//           <button
//             onClick={analyzePDF}
//             className="mt-3 px-2 py-1 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg cursor-pointer w-[120px] md:w-[150px]"
//           >
//             Analyze PDF
//           </button>
//         </div>
//       </div>

//       {/* Search and Fetch Papers Section */}
//       <div className="mb-5">
//         <label className="block text-md md:text-lg text-center md:text-left font-semibold">
//           Search Research Papers
//         </label>
//         <input
//           type="text"
//           placeholder="Enter topic (e.g., AI in Nanogenerators)"
//           className="p-3 text-sm border rounded-lg w-full mt-2"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <div className="flex justify-center">
//           <button
//             onClick={fetchPapers}
//             className="mt-3 px-2 py-1 md:px-4 md:py-2 bg-green-600 hover:bg-green-800 text-white rounded-lg cursor-pointer w-[120px] md:w-[150px]"
//           >
//             Fetch Papers
//           </button>
//         </div>
//       </div>

//       {/* Display Fetched Papers */}
//       {papers.length > 0 && (
//         <div className="mb-5">
//           <label className="block text-lg font-semibold">Select a Paper</label>
//           <ul className="mt-2 border p-3 rounded-lg bg-gray-100">
//             {papers.map((paper, index) => (
//               <li
//                 key={index}
//                 className={`p-2 text-xs md:text-sm cursor-pointer ${
//                   selectedPaper === paper ? "bg-blue-200" : "bg-white"
//                 }`}
//                 onClick={() => setSelectedPaper(paper)}
//               >
//                 {paper.title}
//               </li>
//             ))}
//           </ul>
//           <div className="flex justify-center">
//             <button
//               onClick={analyzeSelectedPaper}
//               className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-800 cursor-pointer text-white rounded-lg w-[210px]"
//             >
//               Analyze Selected Paper
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LogoTitle;

const exercises = [
  {
    name: "Eyebrow Raise",
    route: "/exercises/eyebrow",
    instructions: [
      "Keep your face relaxed.",
      "Raise both eyebrows as high as possible.",
      "Hold for 5 seconds, then relax.",
      "Repeat the motion slowly and evenly.",
    ],
  },
  {
    name: "Frown",
    route: "/exercises/frown",
    instructions: [
      "Try to draw your eyebrows together.",
      "Frown using your forehead muscles.",
      "Hold for 3–5 seconds.",
      "Avoid wrinkling your nose.",
    ],
  },
  {
    name: "Smile",
    route: "/exercises/smile",
    instructions: [
      "Smile broadly while showing your teeth.",
      "Keep lips relaxed and symmetrical.",
      "Hold the smile for 5 seconds.",
      "Focus on lifting both corners equally.",
    ],
  },
  {
    name: "P-sound Pronunciation",
    route: "/exercises/psound",
    instructions: [
      "Purse your lips gently together.",
      "Say 'Puh' with clear burst of air.",
      "Repeat the sound slowly.",
      "Relax your lips between repetitions.",
    ],
  },
];

const ExercisesPage = () => {
  const router = useRouter();

  return (
    <div className=" bg-[#fffbea] p-2">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Choose Your Exercise
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {exercises.map((exercise) => (
          <div
            key={exercise.name}
            className="border border-gray-300 rounded-2xl shadow-md p-6 bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {exercise.name}
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                {exercise.instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => router.push("/create/LogoIdea")}
              className="mt-6 py-2 mx-auto w-[150px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;
