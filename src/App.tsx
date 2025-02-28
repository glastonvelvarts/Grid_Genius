import React, { useState } from 'react';
import { Database, HelpCircle } from 'lucide-react';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Grid from './components/Grid';
import FunctionHelp from './components/FunctionHelp';
import TestData from './components/TestData';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <Database size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">GridGenius</h1>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Spreadsheet</span>
        </div>
        
        <div className="flex items-center gap-3">
          <TestData />
          <button 
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1 text-sm"
            onClick={toggleHelp}
          >
            <HelpCircle size={16} className="text-blue-600" />
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
            <div className="w-80 border-l overflow-auto p-2">
              <FunctionHelp />
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <footer className="flex items-center justify-between p-2 bg-gray-100 border-t text-xs text-gray-600">
        <div>Ready</div>
        <div>100 rows × 26 columns</div>
      </footer>
    </div>
  );
}

export default App;