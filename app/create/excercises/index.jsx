"use client";
import React from "react";
import { useRouter } from "next/navigation";

const exercises = [
  {
    name: "Eyebrow Raise",
    route: "/create/exercises/eyebrow",
    instructions: [
      "Keep your face relaxed.",
      "Raise both eyebrows as high as possible.",
      "Hold for 5 seconds, then relax.",
      "Repeat the motion slowly and evenly.",
    ],
  },
  {
    name: "Frown",
    route: "/create/exercises/frown",
    instructions: [
      "Try to draw your eyebrows together.",
      "Frown using your forehead muscles.",
      "Hold for 3–5 seconds.",
      "Avoid wrinkling your nose.",
    ],
  },
  {
    name: "Smile",
    route: "/create/exercises/smile",
    instructions: [
      "Smile broadly while showing your teeth.",
      "Keep lips relaxed and symmetrical.",
      "Hold the smile for 5 seconds.",
      "Focus on lifting both corners equally.",
    ],
  },
  {
    name: "P-sound Pronunciation",
    route: "/create/exercises/psound", // matches folder name: `app/exercises/psound/page.jsx`
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
    <div className="bg-[#fffbea] p-2">
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
              onClick={() => router.push(exercise.route)}
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
