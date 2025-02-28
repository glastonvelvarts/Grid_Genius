import React, { useState, useEffect } from 'react';
import { Database, HelpCircle, Moon, Sun } from 'lucide-react';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Grid from './components/Grid';
import FunctionHelp from './components/FunctionHelp';
import TestData from './components/TestData';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleHelp = () => setShowHelp(!showHelp);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b shadow-sm dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Database size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">GridGenius</h1>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            Spreadsheet
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 text-sm"
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-600 dark:text-gray-300" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <TestData />
          <button 
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 text-sm"
            onClick={toggleHelp}
          >
            <HelpCircle size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Function Help</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Toolbar />
        <FormulaBar />
        <div className="flex-1 flex overflow-hidden">
          <Grid />
          {showHelp && (
            <div className="w-80 border-l overflow-auto p-2 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
              <FunctionHelp />
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <footer className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
        <div>Ready</div>
        <div>100 rows × 26 columns</div>
      </footer>
    </div>
  );
}


export default App;
