import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { frontendRoutes } from '@dumber-dungeons/shared/src/api/frontend.routes';
import { ThreeJS } from './views/threejs/threejs';
import { LobbyView } from './views/lobby/lobby.view';
import globalStyle from './views/style.css';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorView } from './views/error/error.view';
import { ExternalStyle } from './components/external.style';
import { ParticipantSetupView } from './views/participant.setup/participant.setup.view';

function getRootContainer(): Element {
  const container = document.querySelector('#root');
  if (!container) throw new Error('Missing root!');

  return container;
}

createRoot(getRootContainer()).render(
  <>
    <ExternalStyle href={globalStyle} />
    <ErrorBoundary FallbackComponent={ErrorView}>
      <BrowserRouter>
        <Routes>
          <Route path={frontendRoutes.index} element={<ThreeJS />} />
          <Route path={frontendRoutes.lobby} element={<LobbyView />} />
          <Route path={frontendRoutes.participantSetup} element={<ParticipantSetupView />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </>
);
