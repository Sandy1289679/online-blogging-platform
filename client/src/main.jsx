// src/index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';        // ← add this
import { persistor, store } from './store';               // keep your path if correct
import { PersistGate } from 'redux-persist/integration/react';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <ToastContainer />
      <App />
    </PersistGate>
      
    </Provider>
  </StrictMode>
);
