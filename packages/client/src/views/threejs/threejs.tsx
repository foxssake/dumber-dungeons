import { useEffect, useRef } from 'react';
import type { JSX } from 'react';
import FPSCounter from './fps-counter';
import { ThreeJSPrototype } from './threejs-prototype';

export function ThreeJS(): JSX.Element {
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
  }, 100);

  return (
    <div>
      <h1>three.js test</h1>
      <div id="fps" ref={fpsRef} />
      <canvas ref={canvasRef} />
    </div>
  );
}
