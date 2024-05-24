import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ToastContainer } from 'react-toastify';

import './index.css';
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={4000}
      />
    </DndProvider>
  </React.StrictMode>,
)
