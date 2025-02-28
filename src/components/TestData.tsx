import React from 'react';
import { useSpreadsheetStore } from '../store';

const TestData: React.FC = () => {
  const { updateCellValue } = useSpreadsheetStore();
  
  const loadSampleData = () => {
    // Sample data for testing functions
    const sampleData = [
      // Headers
      { col: 'A', row: 1, value: 'Name' },
      { col: 'B', row: 1, value: 'Age' },
      { col: 'C', row: 1, value: 'Salary' },
      { col: 'D', row: 1, value: 'Department' },
      { col: 'E', row: 1, value: 'Start Date' },
      
      // Row 1
      { col: 'A', row: 2, value: 'John Smith' },
      { col: 'B', row: 2, value: '32' },
      { col: 'C', row: 2, value: '65000' },
      { col: 'D', row: 2, value: 'Engineering' },
      { col: 'E', row: 2, value: '2020-01-15' },
      
      // Row 2
      { col: 'A', row: 3, value: 'Jane Doe' },
      { col: 'B', row: 3, value: '28' },
      { col: 'C', row: 3, value: '72000' },
      { col: 'D', row: 3, value: 'Marketing' },
      { col: 'E', row: 3, value: '2019-06-22' },
      
      // Row 3
      { col: 'A', row: 4, value: 'Bob Johnson' },
      { col: 'B', row: 4, value: '45' },
      { col: 'C', row: 4, value: '85000' },
      { col: 'D', row: 4, value: 'Engineering' },
      { col: 'E', row: 4, value: '2015-03-10' },
      
      // Row 4
      { col: 'A', row: 5, value: 'Alice Brown' },
      { col: 'B', row: 5, value: '37' },
      { col: 'C', row: 5, value: '78000' },
      { col: 'D', row: 5, value: 'Sales' },
      { col: 'E', row: 5, value: '2018-11-05' },
      
      // Row 5 (duplicate of row 3 for testing REMOVE_DUPLICATES)
      { col: 'A', row: 6, value: 'Bob Johnson' },
      { col: 'B', row: 6, value: '45' },
      { col: 'C', row: 6, value: '85000' },
      { col: 'D', row: 6, value: 'Engineering' },
      { col: 'E', row: 6, value: '2015-03-10' },
      
      // Row 6
      { col: 'A', row: 7, value: '  Sarah Wilson  ' }, // Extra spaces for TRIM testing
      { col: 'B', row: 7, value: '29' },
      { col: 'C', row: 7, value: '67000' },
      { col: 'D', row: 7, value: 'HR' },
      { col: 'E', row: 7, value: '2021-02-18' },
      
      // Formula examples
      { col: 'G', row: 2, value: 'Function Examples:' },
      { col: 'G', row: 3, value: 'SUM' },
      { col: 'H', row: 3, value: '=SUM(B2:B7)' },
      
      { col: 'G', row: 4, value: 'AVERAGE' },
      { col: 'H', row: 4, value: '=AVERAGE(C2:C7)' },
      
      { col: 'G', row: 5, value: 'MAX' },
      { col: 'H', row: 5, value: '=MAX(C2:C7)' },
      
      { col: 'G', row: 6, value: 'MIN' },
      { col: 'H', row: 6, value: '=MIN(C2:C7)' },
      
      { col: 'G', row: 7, value: 'COUNT' },
      { col: 'H', row: 7, value: '=COUNT(B2:B7)' },
      
      { col: 'G', row: 9, value: 'TRIM' },
      { col: 'H', row: 9, value: '=TRIM(A7)' },
      
      { col: 'G', row: 10, value: 'UPPER' },
      { col: 'H', row: 10, value: '=UPPER(A2)' },
      
      { col: 'G', row: 11, value: 'LOWER' },
      { col: 'H', row: 11, value: '=LOWER(D3)' },
    ];
    
    // Load the data
    sampleData.forEach(item => {
      updateCellValue(item.row, item.col, item.value);
    });
  };
  
  return (
    <button
      onClick={loadSampleData}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Load Test Data
    </button>
  );
};

export default TestData;