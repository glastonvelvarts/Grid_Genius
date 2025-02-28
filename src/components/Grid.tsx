import React, { useState, useEffect, useRef } from 'react';
import { useSpreadsheetStore } from '../store';
import * as formulaFunctions from '../utils/formulaFunctions';

const COLUMN_HEADERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ROW_COUNT = 100;

const Grid: React.FC = () => {
  const { 
    data, 
    activeCell, 
    setActiveCell, 
    updateCellValue, 
    editMode, 
    setEditMode,
    formulaBarValue,
    setFormulaBarValue,
    selectedRange,
    setSelectedRange
  } = useSpreadsheetStore();
  
  const [editValue, setEditValue] = useState('');
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: string } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const editCellRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (editMode && editCellRef.current) {
      editCellRef.current.focus();
    }
  }, [editMode]);
  
  const handleCellClick = (row: number, col: string, e: React.MouseEvent) => {
    if (e.shiftKey && activeCell) {
      // Extend selection
      setSelectedRange(activeCell, { row, col });
    } else {
      setActiveCell(row, col);
      setSelectionStart({ row, col });
      setIsSelecting(true);
    }
  };
  
  const handleCellDoubleClick = (row: number, col: string) => {
    setActiveCell(row, col);
    setEditMode(true);
    setEditValue(data[row]?.[col]?.formula || data[row]?.[col]?.value || '');
  };
  
  const handleMouseMove = (row: number, col: string) => {
    if (isSelecting && selectionStart) {
      setSelectedRange(selectionStart, { row, col });
    }
  };
  
  const handleMouseUp = () => {
    setIsSelecting(false);
  };
  
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
    setFormulaBarValue(e.target.value);
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: string) => {
    if (e.key === 'Enter') {
      finishEditing(row, col);
    } else if (e.key === 'Escape') {
      setEditMode(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      finishEditing(row, col);
      
      // Move to next cell
      const colIndex = COLUMN_HEADERS.indexOf(col);
      if (colIndex < COLUMN_HEADERS.length - 1) {
        setActiveCell(row, COLUMN_HEADERS[colIndex + 1]);
      } else if (row < ROW_COUNT) {
        setActiveCell(row + 1, COLUMN_HEADERS[0]);
      }
    } else if (e.key === 'ArrowDown' && e.ctrlKey) {
      e.preventDefault();
      finishEditing(row, col);
      if (row < ROW_COUNT) {
        setActiveCell(row + 1, col);
      }
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
      e.preventDefault();
      finishEditing(row, col);
      if (row > 1) {
        setActiveCell(row - 1, col);
      }
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      finishEditing(row, col);
      const colIndex = COLUMN_HEADERS.indexOf(col);
      if (colIndex > 0) {
        setActiveCell(row, COLUMN_HEADERS[colIndex - 1]);
      }
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      finishEditing(row, col);
      const colIndex = COLUMN_HEADERS.indexOf(col);
      if (colIndex < COLUMN_HEADERS.length - 1) {
        setActiveCell(row, COLUMN_HEADERS[colIndex + 1]);
      }
    }
  };
  
  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeCell) return;
    
    const { row, col } = activeCell;
    const colIndex = COLUMN_HEADERS.indexOf(col);
    
    if (e.key === 'Enter') {
      if (!editMode) {
        setEditMode(true);
        setEditValue(data[row]?.[col]?.formula || data[row]?.[col]?.value || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (row < ROW_COUNT) {
        if (e.shiftKey && selectedRange) {
          setSelectedRange(selectedRange.start, { row: row + 1, col });
        } else {
          setActiveCell(row + 1, col);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (row > 1) {
        if (e.shiftKey && selectedRange) {
          setSelectedRange(selectedRange.start, { row: row - 1, col });
        } else {
          setActiveCell(row - 1, col);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (colIndex > 0) {
        if (e.shiftKey && selectedRange) {
          setSelectedRange(selectedRange.start, { row, col: COLUMN_HEADERS[colIndex - 1] });
        } else {
          setActiveCell(row, COLUMN_HEADERS[colIndex - 1]);
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (colIndex < COLUMN_HEADERS.length - 1) {
        if (e.shiftKey && selectedRange) {
          setSelectedRange(selectedRange.start, { row, col: COLUMN_HEADERS[colIndex + 1] });
        } else {
          setActiveCell(row, COLUMN_HEADERS[colIndex + 1]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (colIndex < COLUMN_HEADERS.length - 1) {
        setActiveCell(row, COLUMN_HEADERS[colIndex + 1]);
      } else if (row < ROW_COUNT) {
        setActiveCell(row + 1, COLUMN_HEADERS[0]);
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedRange) {
        // Clear all cells in the selected range
        const { start, end } = selectedRange;
        const startColIndex = COLUMN_HEADERS.indexOf(start.col);
        const endColIndex = COLUMN_HEADERS.indexOf(end.col);
        
        for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
          for (let c = Math.min(startColIndex, endColIndex); c <= Math.max(startColIndex, endColIndex); c++) {
            updateCellValue(r, COLUMN_HEADERS[c], '');
          }
        }
      } else {
        updateCellValue(row, col, '');
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start editing with the pressed key
      setEditMode(true);
      setEditValue(e.key);
      setFormulaBarValue(e.key);
    }
  };
  
  const finishEditing = (row: number, col: string) => {
    updateCellValue(row, col, editValue);
    setEditMode(false);
  };
  
  const getCellStyle = (row: number, col: string) => {
    const cellStyle = data[row]?.[col]?.style;
    if (!cellStyle) return {};
    
    return {
      fontWeight: cellStyle.bold ? 'bold' : 'normal',
      fontStyle: cellStyle.italic ? 'italic' : 'normal',
      textDecoration: cellStyle.underline ? 'underline' : 'none',
      textAlign: cellStyle.align,
      backgroundColor: cellStyle.backgroundColor,
      color: cellStyle.textColor,
    };
  };
  
  const isCellInRange = (row: number, col: string): boolean => {
    if (!selectedRange) return false;
    
    const { start, end } = selectedRange;
    const startColIndex = COLUMN_HEADERS.indexOf(start.col);
    const endColIndex = COLUMN_HEADERS.indexOf(end.col);
    const colIndex = COLUMN_HEADERS.indexOf(col);
    
    return (
      row >= Math.min(start.row, end.row) &&
      row <= Math.max(start.row, end.row) &&
      colIndex >= Math.min(startColIndex, endColIndex) &&
      colIndex <= Math.max(startColIndex, endColIndex)
    );
  };
  
  const formatCellValue = (row: number, col: string): string => {
    const cellData = data[row]?.[col];
    if (!cellData) return '';
    
    const value = cellData.value;
    
    if (cellData.dataType === 'date') {
      return formulaFunctions.formatDate(value);
    }
    
    return value;
  };
  
  return (
    <div 
      ref={gridRef}
      className="flex-1 overflow-auto focus:outline-none"
      tabIndex={0}
      onKeyDown={handleGridKeyDown}
    >
      <div className="inline-block min-w-full">
        {/* Column Headers */}
        <div className="sticky top-0 z-10 flex bg-gray-100 border-b">
          <div className="w-10 h-8 flex items-center justify-center border-r bg-gray-200"></div>
          {COLUMN_HEADERS.map((col) => (
            <div 
              key={col} 
              className="w-24 h-8 flex items-center justify-center border-r font-medium text-gray-700"
            >
              {col}
            </div>
          ))}
        </div>
        
        {/* Grid Rows */}
        {Array.from({ length: ROW_COUNT }, (_, i) => i + 1).map((row) => (
          <div key={row} className="flex">
            {/* Row Header */}
            <div className="sticky left-0 z-10 w-10 h-8 flex items-center justify-center border-r border-b bg-gray-100 font-medium text-gray-700">
              {row}
            </div>
            
            {/* Row Cells */}
            {COLUMN_HEADERS.map((col) => {
              const isActive = activeCell?.row === row && activeCell?.col === col;
              const isInRange = isCellInRange(row, col);
              const cellValue = formatCellValue(row, col);
              
              return (
                <div 
                  key={`${row}-${col}`}
                  className={`w-24 h-8 border-r border-b relative 
                    ${isActive ? 'ring-2 ring-blue-500 z-20' : ''} 
                    ${isInRange ? 'bg-blue-50' : ''}`}
                  onClick={(e) => handleCellClick(row, col, e)}
                  onDoubleClick={() => handleCellDoubleClick(row, col)}
                  onMouseMove={() => handleMouseMove(row, col)}
                  style={getCellStyle(row, col)}
                >
                  {isActive && editMode ? (
                    <input
                      ref={editCellRef}
                      type="text"
                      value={editValue}
                      onChange={handleEditChange}
                      onKeyDown={(e) => handleEditKeyDown(e, row, col)}
                      onBlur={() => finishEditing(row, col)}
                      className="absolute inset-0 w-full h-full px-1 border-0 focus:outline-none"
                      style={getCellStyle(row, col)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full px-1 overflow-hidden text-ellipsis whitespace-nowrap flex items-center" 
                      style={{ 
                        justifyContent: getCellStyle(row, col).textAlign === 'left' 
                          ? 'flex-start' 
                          : getCellStyle(row, col).textAlign === 'right' 
                            ? 'flex-end' 
                            : 'center' 
                      }}
                    >
                      {cellValue}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;