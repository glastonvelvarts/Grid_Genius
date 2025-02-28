import React from 'react';
import { X } from 'lucide-react';
import { useSpreadsheetStore } from '../store';

const FindReplaceDialog: React.FC = () => {
  const { 
    setFindReplaceOpen, 
    findValue, 
    setFindValue, 
    replaceValue, 
    setReplaceValue,
    findAndReplace
  } = useSpreadsheetStore();
  
  const handleClose = () => {
    setFindReplaceOpen(false);
  };
  
  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindValue(e.target.value);
  };
  
  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplaceValue(e.target.value);
  };
  
  const handleReplace = () => {
    findAndReplace();
  };
  
  return (
    <div className="absolute top-16 right-4 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Find and Replace</h3>
        <button 
          className="p-1 rounded hover:bg-gray-100"
          onClick={handleClose}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="find" className="block text-sm font-medium text-gray-700 mb-1">
            Find
          </label>
          <input
            id="find"
            type="text"
            value={findValue}
            onChange={handleFindChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Text to find"
          />
        </div>
        
        <div>
          <label htmlFor="replace" className="block text-sm font-medium text-gray-700 mb-1">
            Replace with
          </label>
          <input
            id="replace"
            type="text"
            value={replaceValue}
            onChange={handleReplaceChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Replacement text"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            onClick={handleReplace}
            disabled={!findValue}
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindReplaceDialog;