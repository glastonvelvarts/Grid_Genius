import { create } from 'zustand';
import { CellData, CellStyle, SpreadsheetState } from './types';
import * as formulaFunctions from './utils/formulaFunctions';

const DEFAULT_CELL_STYLE: CellStyle = {
  bold: false,
  italic: false,
  underline: false,
  align: 'left',
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

const DEFAULT_CELL_DATA: CellData = {
  value: '',
  formula: '',
  style: DEFAULT_CELL_STYLE,
  dataType: 'text',
};

const createEmptyData = () => {
  const data: Record<string, Record<string, CellData>> = {};
  // Create 100 rows
  for (let i = 1; i <= 100; i++) {
    data[i] = {};
    // Create 26 columns (A-Z)
    for (let j = 0; j < 26; j++) {
      const col = String.fromCharCode(65 + j);
      data[i][col] = { ...DEFAULT_CELL_DATA };
    }
  }
  return data;
};

const getCellValue = (cellRef: string, data: Record<string, Record<string, CellData>>): string => {
  const colRef = cellRef.replace(/[0-9]/g, '');
  const rowRef = parseInt(cellRef.replace(/[A-Z]/g, ''));
  return data[rowRef]?.[colRef]?.value || '';
};

const getCellsInRange = (range: string, data: Record<string, Record<string, CellData>>): string[] => {
  const { startCol, startRow, endCol, endRow } = formulaFunctions.parseCellRange(range);
  
  const startColCode = startCol.charCodeAt(0);
  const endColCode = endCol.charCodeAt(0);
  
  const values: string[] = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let colCode = startColCode; colCode <= endColCode; colCode++) {
      const col = String.fromCharCode(colCode);
      const cellValue = data[row]?.[col]?.value || '';
      values.push(cellValue);
    }
  }
  
  return values;
};

const evaluateFormula = (formula: string, row: number, col: string, data: Record<string, Record<string, CellData>>): string => {
  if (!formula.startsWith('=')) return formula;
  
  try {
    // Remove the equals sign
    let expression = formula.substring(1).trim();
    
    // Handle built-in functions
    const sumRegex = /SUM\(([A-Z][0-9]+:[A-Z][0-9]+)\)/gi;
    expression = expression.replace(sumRegex, (_, range) => {
      const values = getCellsInRange(range, data);
      return formulaFunctions.SUM(values).toString();
    });
    
    const avgRegex = /AVERAGE\(([A-Z][0-9]+:[A-Z][0-9]+)\)/gi;
    expression = expression.replace(avgRegex, (_, range) => {
      const values = getCellsInRange(range, data);
      return formulaFunctions.AVERAGE(values).toString();
    });
    
    const maxRegex = /MAX\(([A-Z][0-9]+:[A-Z][0-9]+)\)/gi;
    expression = expression.replace(maxRegex, (_, range) => {
      const values = getCellsInRange(range, data);
      return formulaFunctions.MAX(values).toString();
    });
    
    const minRegex = /MIN\(([A-Z][0-9]+:[A-Z][0-9]+)\)/gi;
    expression = expression.replace(minRegex, (_, range) => {
      const values = getCellsInRange(range, data);
      return formulaFunctions.MIN(values).toString();
    });
    
    const countRegex = /COUNT\(([A-Z][0-9]+:[A-Z][0-9]+)\)/gi;
    expression = expression.replace(countRegex, (_, range) => {
      const values = getCellsInRange(range, data);
      return formulaFunctions.COUNT(values).toString();
    });
    
    const trimRegex = /TRIM\(([A-Z][0-9]+)\)/gi;
    expression = expression.replace(trimRegex, (_, cellRef) => {
      const value = getCellValue(cellRef, data);
      return `"${formulaFunctions.TRIM(value)}"`;
    });
    
    const upperRegex = /UPPER\(([A-Z][0-9]+)\)/gi;
    expression = expression.replace(upperRegex, (_, cellRef) => {
      const value = getCellValue(cellRef, data);
      return `"${formulaFunctions.UPPER(value)}"`;
    });
    
    const lowerRegex = /LOWER\(([A-Z][0-9]+)\)/gi;
    expression = expression.replace(lowerRegex, (_, cellRef) => {
      const value = getCellValue(cellRef, data);
      return `"${formulaFunctions.LOWER(value)}"`;
    });
    
    // Replace cell references with their values
    const cellRefRegex = /[A-Z]+[0-9]+/g;
    expression = expression.replace(cellRefRegex, (match) => {
      const colRef = match.replace(/[0-9]/g, '');
      const rowRef = parseInt(match.replace(/[A-Z]/g, ''));
      
      // Check for circular references (simplified)
      if (rowRef === row && colRef === col) {
        throw new Error('Circular reference detected');
      }
      
      const cellValue = data[rowRef]?.[colRef]?.value || '0';
      // If the cell value is numeric, return it directly
      return isNaN(Number(cellValue)) ? `"${cellValue}"` : cellValue;
    });
    
    // Evaluate the expression
    // eslint-disable-next-line no-eval
    const result = eval(expression);
    return result.toString();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
};

const detectDataType = (value: string): 'number' | 'date' | 'text' => {
  if (formulaFunctions.isNumeric(value)) return 'number';
  if (formulaFunctions.isDate(value)) return 'date';
  return 'text';
};

export const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  data: createEmptyData(),
  activeCell: null,
  selectedRange: null,
  columnWidths: {},
  rowHeights: {},
  editMode: false,
  formulaBarValue: '',
  findReplaceOpen: false,
  findValue: '',
  replaceValue: '',
  
  setActiveCell: (row, col) => {
    const cellData = get().data[row]?.[col] || DEFAULT_CELL_DATA;
    set({ 
      activeCell: { row, col },
      selectedRange: null,
      formulaBarValue: cellData.formula || cellData.value,
      editMode: false,
    });
  },
  
  updateCellValue: (row, col, value, isFormula = false) => {
    set((state) => {
      const newData = { ...state.data };
      
      if (!newData[row]) {
        newData[row] = {};
      }
      
      if (!newData[row][col]) {
        newData[row][col] = { ...DEFAULT_CELL_DATA };
      }
      
      const formula = isFormula || value.startsWith('=') ? value : '';
      const displayValue = formula ? get().evaluateFormula(value, row, col) : value;
      const dataType = detectDataType(displayValue);
      
      newData[row][col] = {
        ...newData[row][col],
        value: displayValue,
        formula: formula,
        dataType: dataType,
      };
      
      return { 
        data: newData,
        formulaBarValue: value,
      };
    });
  },
  
  updateCellStyle: (row, col, style) => {
    set((state) => {
      const newData = { ...state.data };
      
      if (!newData[row]) {
        newData[row] = {};
      }
      
      if (!newData[row][col]) {
        newData[row][col] = { ...DEFAULT_CELL_DATA };
      }
      
      newData[row][col] = {
        ...newData[row][col],
        style: {
          ...newData[row][col].style,
          ...style,
        },
      };
      
      return { data: newData };
    });
  },
  
  setEditMode: (editing) => {
    set({ editMode: editing });
  },
  
  setFormulaBarValue: (value) => {
    set({ formulaBarValue: value });
  },
  
  evaluateFormula: (formula, row, col) => {
    return evaluateFormula(formula, row, col, get().data);
  },
  
  setSelectedRange: (start, end) => {
    set({ 
      selectedRange: { start, end },
      activeCell: start,
    });
  },
  
  removeDuplicates: () => {
    const { selectedRange, data } = get();
    if (!selectedRange) return;
    
    const { start, end } = selectedRange;
    const { startCol, startRow, endCol, endRow } = formulaFunctions.parseCellRange(`${start.col}${start.row}:${end.col}${end.row}`);
    
    const startColCode = startCol.charCodeAt(0);
    const endColCode = endCol.charCodeAt(0);
    
    // Get all rows in the range
    const rows: Record<number, Record<string, CellData>> = {};
    for (let row = startRow; row <= endRow; row++) {
      rows[row] = {};
      for (let colCode = startColCode; colCode <= endColCode; colCode++) {
        const col = String.fromCharCode(colCode);
        rows[row][col] = data[row]?.[col] || { ...DEFAULT_CELL_DATA };
      }
    }
    
    // Find duplicates
    const seen = new Set<string>();
    const duplicates = new Set<number>();
    
    for (let row = startRow; row <= endRow; row++) {
      // Create a string representation of the row for comparison
      const rowValues: string[] = [];
      for (let colCode = startColCode; colCode <= endColCode; colCode++) {
        const col = String.fromCharCode(colCode);
        rowValues.push(data[row]?.[col]?.value || '');
      }
      
      const rowString = rowValues.join('|');
      if (seen.has(rowString)) {
        duplicates.add(row);
      } else {
        seen.add(rowString);
      }
    }
    
    // Remove duplicates
    set((state) => {
      const newData = { ...state.data };
      
      // Clear duplicate rows
      duplicates.forEach(row => {
        for (let colCode = startColCode; colCode <= endColCode; colCode++) {
          const col = String.fromCharCode(colCode);
          if (newData[row] && newData[row][col]) {
            newData[row][col] = { ...DEFAULT_CELL_DATA };
          }
        }
      });
      
      return { data: newData };
    });
  },
  
  setFindReplaceOpen: (open) => {
    set({ findReplaceOpen: open });
  },
  
  setFindValue: (value) => {
    set({ findValue: value });
  },
  
  setReplaceValue: (value) => {
    set({ replaceValue: value });
  },
  
  findAndReplace: () => {
    const { findValue, replaceValue, selectedRange, data } = get();
    if (!findValue || !selectedRange) return;
    
    const { start, end } = selectedRange;
    const { startCol, startRow, endCol, endRow } = formulaFunctions.parseCellRange(`${start.col}${start.row}:${end.col}${end.row}`);
    
    const startColCode = startCol.charCodeAt(0);
    const endColCode = endCol.charCodeAt(0);
    
    set((state) => {
      const newData = { ...state.data };
      
      for (let row = startRow; row <= endRow; row++) {
        for (let colCode = startColCode; colCode <= endColCode; colCode++) {
          const col = String.fromCharCode(colCode);
          
          if (newData[row] && newData[row][col]) {
            const cellValue = newData[row][col].value;
            const cellFormula = newData[row][col].formula;
            
            if (cellValue.includes(findValue)) {
              const newValue = cellValue.replaceAll(findValue, replaceValue);
              
              if (cellFormula) {
                const newFormula = cellFormula.replaceAll(findValue, replaceValue);
                newData[row][col] = {
                  ...newData[row][col],
                  value: newValue,
                  formula: newFormula,
                };
              } else {
                newData[row][col] = {
                  ...newData[row][col],
                  value: newValue,
                };
              }
            }
          }
        }
      }
      
      return { data: newData };
    });
  },
}));