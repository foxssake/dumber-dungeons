'use client';

import FPSCounter from "./fps-counter";
import runSimulation from "./simulation";
import { useRef } from "react";

export default function ThreeJS() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const fpsCounter = new FPSCounter(128);

  // Run deferred
  setTimeout(
    () => runSimulation(canvasRef.current!!, fpsCounter),
    0
  );

  // Periodically update counter
  setInterval(
    () => {
      if (fpsRef.current)
        fpsRef.current.innerText = Math.round(fpsCounter.averageFps).toFixed(0) + 'fps'
    },
    0.1
  );

  return (
    <div>
      <h1>three.js test</h1>
      <div id="fps" ref={fpsRef} />
      <canvas ref={canvasRef} />
    </div>
  )
}