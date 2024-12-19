import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { frontendRoutes } from '@dumber-dungeons/shared/src/api/frontend.routes';
import { ThreeJS } from "./views/threejs/threejs";
import { LobbyView } from "./views/lobby/lobby.view";
import { Style } from "./components/style";
import globalStyle from "./views/style.css";

function getRootContainer(): Element {
  const container = document.querySelector('#root');
  if (container) {
    return container;
  }

  const element = document.createElement('div')
  element.id = 'root';
  document.body.appendChild(element);

  return element;
}

createRoot(getRootContainer()).render(
  <BrowserRouter>
    <Style href={globalStyle} />
    <Routes>
      <Route path={frontendRoutes.index} element={<ThreeJS />} />
      <Route path={frontendRoutes.lobby} element={<LobbyView />} />
    </Routes>
  </BrowserRouter>
)
