import { useRef } from "react";
import { createRoot } from 'react-dom/client';
import FPSCounter from "./fps-counter";
import { ThreeJSPrototype } from "./threejs-prototype";

const root = createRoot(document.getElementById('root')!);
root.render(<ThreeJS/>);

function ThreeJS() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const fpsCounter = new FPSCounter(128);

  const prototype = new ThreeJSPrototype();

  // Run deferred
  setTimeout(
    () => prototype.run(canvasRef.current!!, fpsCounter),
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
