import React, { useEffect, useRef } from 'react';
import { useSpreadsheetStore } from '../store';
import { FunctionSquare as Function } from 'lucide-react';

const FormulaBar: React.FC = () => {
  const { 
    activeCell, 
    formulaBarValue, 
    setFormulaBarValue, 
    updateCellValue 
  } = useSpreadsheetStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCell]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaBarValue(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && activeCell) {
      updateCellValue(activeCell.row, activeCell.col, formulaBarValue);
    }
  };
  
  const handleBlur = () => {
    if (activeCell) {
      updateCellValue(activeCell.row, activeCell.col, formulaBarValue);
    }
  };
  
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white">
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
        <Function size={16} className="text-gray-500" />
        <span className="text-sm font-medium">
          {activeCell ? `${activeCell.col}${activeCell.row}` : ''}
        </span>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={formulaBarValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Enter value or formula (start with =)"
        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        disabled={!activeCell}
      />
    </div>
  );
};

export default FormulaBar;