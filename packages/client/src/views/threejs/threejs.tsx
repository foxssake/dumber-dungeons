import { useEffect, useRef } from 'react';
import type { JSX } from 'react';
import { createRoot } from 'react-dom/client';
import FPSCounter from './fps-counter';
import { ThreeJSPrototype } from './threejs-prototype';

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(<ThreeJS />);

function ThreeJS(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);
  const fpsCounter = new FPSCounter(128);

  const prototype = new ThreeJSPrototype();

  useEffect(() => {
    if (!canvasRef.current) return;
    void prototype.run(canvasRef.current, fpsCounter);
  }, [canvasRef]);

  // Periodically update counter
  setInterval(() => {
    if (fpsRef.current)
      fpsRef.current.innerText = `${Math.round(fpsCounter.averageFps).toFixed(0)}fps`;
  }, 0.1);

  return (
    <div>
      <h1>three.js test</h1>
      <div id="fps" ref={fpsRef} />
      <canvas ref={canvasRef} />
    </div>
  );
}
