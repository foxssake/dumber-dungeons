import 'react';
import { createRoot } from 'react-dom/client';
import { ThreeJS } from './views/threejs/threejs.tsx';

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(<ThreeJS />);
