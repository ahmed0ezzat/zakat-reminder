import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { LangContext } from './lang';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LangContext.Provider value="ar">
        <App />
      </LangContext.Provider>
    </BrowserRouter>
  </StrictMode>,
);