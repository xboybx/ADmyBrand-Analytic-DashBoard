import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;