import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
