import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/App/App';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.register();
