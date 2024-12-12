import 'react';
import { createRoot } from 'react-dom/client';
import { ThreeJS } from './views/threejs/threejs.tsx';
import styleCss from './views/style.css';

const globalCssLink = document.createElement('link');
globalCssLink.rel = 'stylesheet';
globalCssLink.href = styleCss;
document.head.appendChild(globalCssLink);

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(<ThreeJS />);
