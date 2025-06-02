"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

export default function FrownPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraInstance, setCameraInstance] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [faceMeshInstance, setFaceMeshInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cleanupRef = useRef(false);

  const cleanup = useCallback(() => {
    if (cleanupRef.current) return;
    cleanupRef.current = true;

    try {
      if (cameraInstance) {
        cameraInstance.stop();
        setCameraInstance(null);
      }
    } catch (err) {
      console.warn("Error stopping camera:", err);
    }

    try {
      if (faceMeshInstance && typeof faceMeshInstance.close === "function") {
        faceMeshInstance.close();
        setFaceMeshInstance(null);
      }
    } catch (err) {
      console.warn("Error closing face mesh:", err);
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setStreaming(false);
    setIsLoading(false);

    setTimeout(() => {
      cleanupRef.current = false;
    }, 100);
  }, [cameraInstance, faceMeshInstance]);

  useEffect(() => {
    if (!streaming) return;

    let faceMesh = null;
    let camera = null;
    let isComponentMounted = true;

    const loadMediaPipe = async () => {
      setIsLoading(true);

      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve();
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

      try {
        await Promise.all([
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
          ),
        ]);

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

        faceMesh.onResults((results) => {
          const canvas = canvasRef.current;
          if (!canvas || !results.multiFaceLandmarks.length) return;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const landmarks = results.multiFaceLandmarks[0];

          const drawPoints = (indices, fill, stroke) => {
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            indices.forEach((i) => {
              const pt = landmarks[i];
              const x = pt.x * canvas.width;
              const y = pt.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            });
          };

          // Better indices (adjusted from MediaPipe landmark spec)
          drawPoints(
            [70, 63, 105, 66, 107, 336, 296, 334, 293, 300],
            "#ff6b6b",
            "#cc0000"
          ); // Glabella
          // drawPoints([61, 291, 57, 287], "#ffd93d", "#b58900"); // Inner Brow
          drawPoints(
            [78, 95, 88, 178, 87, 14, 13, 317, 402, 318, 324, 308],
            "#4ecdc4",
            "#008080"
          ); // Mouth downturn
        });

        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMesh) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();

        setCameraInstance(camera);
        setFaceMeshInstance(faceMesh);
        setIsLoading(false);
      } catch (err) {
        console.error("MediaPipe error:", err);
        setIsLoading(false);
      }
    };

    loadMediaPipe();

    return () => {
      isComponentMounted = false;
      if (camera) camera.stop();
      if (faceMesh && typeof faceMesh.close === "function") {
        try {
          faceMesh.close();
        } catch (_ignored) {
          // If you’ve already closed it earlier, this binding error is thrown.
          // Swallow it so it doesn’t bubble up into the console.
        }
        // (Optionally clear that reference so “faceMesh” is no longer truthy.)
        faceMesh = null;
      }
    };
  }, [streaming]);

  const startCamera = useCallback(() => {
    if (!streaming && !isLoading) {
      cleanupRef.current = false;
      setStreaming(true);
    }
  }, [streaming, isLoading]);

  const stopCamera = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-4">Frown Exercise</h1>

      <div className="relative w-full max-w-md aspect-video rounded-xl border-4 border-purple-400 overflow-hidden shadow-2xl bg-gray-900">
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

      <div className="bg-white rounded-xl shadow mt-4 p-3 w-full max-w-md text-xs">
        <h3 className="font-semibold text-gray-800 mb-2">Muscle Groups:</h3>
        <div className="flex flex-wrap gap-3 text-gray-700">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <span>Glabella/Brow</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-teal-400 rounded-full" />
            <span>Mouth/Jaw</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow mt-4 p-4 w-full max-w-md text-sm text-gray-800">
        <ul className="list-disc list-inside space-y-1">
          <li>Keep your face relaxed and look directly at the camera.</li>
          <li>Furrow your brow by bringing your eyebrows together and down.</li>
          <li>Turn the corners of your mouth downward slightly.</li>
          <li>Hold the frown for 5 seconds, then relax slowly.</li>
          <li>Repeat 8–10 times to strengthen facial muscles.</li>
        </ul>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={startCamera}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-lg disabled:opacity-50"
          disabled={streaming || isLoading}
        >
          {isLoading ? "Loading..." : streaming ? "Running..." : "Start"}
        </button>
        <button
          onClick={stopCamera}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg disabled:opacity-50"
          disabled={!streaming && !isLoading}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
