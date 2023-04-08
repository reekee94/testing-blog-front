import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import App from './components/App';
import store from './app/store';



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
