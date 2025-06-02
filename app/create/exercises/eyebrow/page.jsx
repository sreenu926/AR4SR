"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

export default function EyebrowPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraInstance, setCameraInstance] = useState(null);
  const [faceMeshInstance, setFaceMeshInstance] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cleanupRef = useRef(false);

  // Shared cleanup: stops camera & closes FaceMesh, clears canvas, resets flags
  const cleanup = useCallback(() => {
    if (cleanupRef.current) return;
    cleanupRef.current = true;

    // 1) Stop the camera
    try {
      if (cameraInstance) {
        cameraInstance.stop();
        setCameraInstance(null);
      }
    } catch (err) {
      console.warn("Error stopping camera:", err);
    }

    // 2) Close FaceMesh if it exists
    try {
      if (faceMeshInstance && typeof faceMeshInstance.close === "function") {
        faceMeshInstance.close();
        setFaceMeshInstance(null);
      }
    } catch (err) {
      console.warn("Error closing FaceMesh:", err);
    }

    // 3) Clear the overlay canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 4) Reset flags
    setStreaming(false);
    setIsLoading(false);

    // Allow cleanup to run again if user restarts
    setTimeout(() => {
      cleanupRef.current = false;
    }, 100);
  }, [cameraInstance, faceMeshInstance]);

  // Main effect: when “streaming” is true, load MediaPipe scripts, start FaceMesh + camera
  useEffect(() => {
    if (!streaming) return;

    let faceMesh = null;
    let camera = null;
    let isComponentMounted = true;

    const loadMediaPipe = async () => {
      setIsLoading(true);

      // Helper: dynamically inject a <script> tag if it’s not already present
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
        // 1) Load camera_utils.js and face_mesh.js in parallel
        await Promise.all([
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
          ),
        ]);

        // 2) Give the WASM bits a moment to finish loading
        await new Promise((r) => setTimeout(r, 200));

        if (!isComponentMounted || !window.FaceMesh) {
          console.error("FaceMesh failed to load.");
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

        // 4) On each result, draw only eyebrow points
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

            // “Push‐up” eyebrow indices (higher on the ridge)
            const leftEyebrowIndices = [70, 63, 105, 66, 107];
            const rightEyebrowIndices = [300, 293, 334, 296, 336];
            const eyebrowIndices = [
              ...leftEyebrowIndices,
              ...rightEyebrowIndices,
            ];

            ctx.fillStyle = "#FFD93D"; // bright yellow
            ctx.strokeStyle = "#C49B00"; // darker gold
            ctx.lineWidth = 2;

            eyebrowIndices.forEach((i) => {
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

        // 5) Create and start the MediaPipe Camera
        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (faceMesh && typeof faceMesh.send === "function") {
              try {
                await faceMesh.send({ image: videoRef.current });
              } catch (_err) {
                // If faceMesh was closed already, ignore the error
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

    return () => {
      isComponentMounted = false;
      if (camera) camera.stop();
      if (faceMesh && typeof faceMesh.close === "function") {
        try {
          faceMesh.close();
        } catch (_ignore) {
          // Already closed—ignore
        }
      }
    };
  }, [streaming]);

  // “Start” button callback: only if not already streaming/loading
  const startCamera = useCallback(() => {
    if (!streaming && !isLoading) {
      cleanupRef.current = false;
      setStreaming(true);
    }
  }, [streaming, isLoading]);

  // “Stop” button callback: run cleanup
  const stopCamera = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-4">
        Eyebrow Raise Exercise
      </h1>

      {/* Video + Canvas Container */}
      <div className="relative w-full max-w-md aspect-video rounded-xl border-4 border-yellow-400 overflow-hidden shadow-2xl bg-gray-900">
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
        {/* Loading / Webcam Off Overlay */}
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
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Eyebrow</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow mt-4 p-4 w-full max-w-md text-sm text-gray-800">
        <ul className="list-disc list-inside space-y-1">
          <li>Keep your face relaxed and look directly at the camera.</li>
          <li>Raise both eyebrows as high as possible.</li>
          <li>Hold for 5 seconds, then relax slowly.</li>
          <li>Repeat the motion 10 times for best results.</li>
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
