"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SmilePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraInstance, setCameraInstance] = useState(null);
  const [faceMeshInstance, setFaceMeshInstance] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cleanupRef = useRef(false);
  const router = useRouter();

  // Cleanup function that can be called both from “Stop” button or unmount
  const cleanup = useCallback(() => {
    if (cleanupRef.current) return;
    cleanupRef.current = true;

    // 1) Stop camera if running
    try {
      if (cameraInstance) {
        cameraInstance.stop();
        setCameraInstance(null);
      }
    } catch (err) {
      console.warn("Error stopping camera:", err);
    }

    // 2) Close FaceMesh if instantiated
    try {
      if (faceMeshInstance && typeof faceMeshInstance.close === "function") {
        faceMeshInstance.close();
        setFaceMeshInstance(null);
      }
    } catch (err) {
      console.warn("Error closing FaceMesh:", err);
    }

    // 3) Clear the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 4) Reset streaming/loading flags
    setStreaming(false);
    setIsLoading(false);

    // Allow cleanup to run again if user restarts
    setTimeout(() => {
      cleanupRef.current = false;
    }, 100);
  }, [cameraInstance, faceMeshInstance]);

  // Main useEffect: loads MediaPipe, starts camera & FaceMesh on “streaming”
  useEffect(() => {
    if (!streaming) return;

    let faceMesh = null;
    let camera = null;
    let isComponentMounted = true;

    const loadMediaPipe = async () => {
      setIsLoading(true);

      // Helper to insert <script> only once
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const s = document.createElement("script");
          s.src = src;
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });

      try {
        // 1) Parallel‐load camera_utils.js and face_mesh.js
        await Promise.all([
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
          ),
        ]);

        // 2) Wait a short moment so the WASM can initialize
        await new Promise((r) => setTimeout(r, 200));

        if (!isComponentMounted || !window.FaceMesh) {
          console.error("FaceMesh did not load correctly.");
          setIsLoading(false);
          return;
        }

        // 3) Instantiate FaceMesh
        faceMesh = new window.FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        // 4) On each FaceMesh result, draw only the outer lip points
        faceMesh.onResults((results) => {
          if (!isComponentMounted) return;
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (
            results.multiFaceLandmarks &&
            results.multiFaceLandmarks.length > 0
          ) {
            const landmarks = results.multiFaceLandmarks[0];

            // ───── “Smile” indices: outer lip boundary ─────
            const smileIndices = [
              61,
              146,
              91,
              181,
              84,
              17, // left half of outer lip
              314,
              405,
              321,
              375,
              291,
              308, // right half of outer lip
            ];

            ctx.fillStyle = "#4ecdc4"; // teal fill
            ctx.strokeStyle = "#008080"; // darker teal stroke
            ctx.lineWidth = 1.5;

            smileIndices.forEach((i) => {
              const pt = landmarks[i];
              if (!pt) return;
              const x = pt.x * canvas.width;
              const y = pt.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            });
          }
        });

        // 5) Create the MediaPipe Camera, guarded send()
        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMesh && typeof faceMesh.send === "function") {
              try {
                await faceMesh.send({ image: videoRef.current });
              } catch (_err) {
                // faceMesh might be closed—ignore errors
              }
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();

        if (isComponentMounted) {
          setCameraInstance(camera);
          setFaceMeshInstance(faceMesh);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading MediaPipe or starting camera:", err);
        if (isComponentMounted) setIsLoading(false);
      }
    };

    loadMediaPipe();

    // Cleanup when streaming turns false or component unmounts
    return () => {
      isComponentMounted = false;
      if (camera) camera.stop();
      if (faceMesh && typeof faceMesh.close === "function") {
        try {
          faceMesh.close();
        } catch (_ignored) {
          // Already closed—ignore
        }
      }
    };
  }, [streaming]);

  // Press “Start”: enable streaming if not already started or loading
  const startCamera = useCallback(() => {
    if (!streaming && !isLoading) {
      cleanupRef.current = false;
      setStreaming(true);
    }
  }, [streaming, isLoading]);

  // Press “Stop”: run the same cleanup logic
  const stopCamera = useCallback(() => {
    cleanup();
    router.push("/create?title=exercises");
  }, [cleanup, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-4">Smile Exercise</h1>

      {/* Video + Canvas Container */}
      <div className="relative w-full max-w-md aspect-video rounded-xl border-4 border-green-400 overflow-hidden shadow-2xl bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full"
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black bg-opacity-50">
            {isLoading ? "Loading MediaPipe..." : "Webcam is off"}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow mt-4 p-3 w-full max-w-md text-xs text-gray-800">
        <h3 className="font-semibold mb-2">Muscle Groups:</h3>
        <div className="flex flex-wrap gap-3 text-gray-700">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
            <span>Mouth/Jaw (Smile)</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow mt-4 p-4 w-full max-w-md text-sm text-gray-800">
        <ul className="list-disc list-inside space-y-1">
          <li>Keep your face relaxed and look directly at the camera.</li>
          <li>Smile widely, lifting both corners of your mouth.</li>
          <li>Hold the smile for 5 seconds, then relax slowly.</li>
          <li>Repeat 8–10 times to strengthen facial muscles.</li>
        </ul>
      </div>

      {/* Start / Stop Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={startCamera}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={streaming || isLoading}
        >
          {isLoading ? "Loading..." : streaming ? "Running..." : "Start"}
        </button>
        <button
          onClick={stopCamera}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!streaming && !isLoading}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
