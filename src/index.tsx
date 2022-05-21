import './index.css';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App } from './components/App/App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

serviceWorker.register();
