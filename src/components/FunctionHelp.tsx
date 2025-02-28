import React from 'react';
import { HelpCircle } from 'lucide-react';

const FunctionHelp: React.FC = () => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="text-blue-500" size={20} />
        <h2 className="text-lg font-semibold">Function Reference</h2>
      </div>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-md font-medium mb-2 text-blue-700">Mathematical Functions</h3>
          <ul className="space-y-2">
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">SUM(range)</code>
              <p className="text-sm mt-1">Calculates the sum of values in the range.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=SUM(A1:A10)</code></p>
            </li>
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">AVERAGE(range)</code>
              <p className="text-sm mt-1">Calculates the average of values in the range.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=AVERAGE(B1:B10)</code></p>
            </li>
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">MAX(range)</code>
              <p className="text-sm mt-1">Returns the maximum value in the range.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=MAX(C1:C10)</code></p>
            </li>
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">MIN(range)</code>
              <p className="text-sm mt-1">Returns the minimum value in the range.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=MIN(D1:D10)</code></p>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">COUNT(range)</code>
              <p className="text-sm mt-1">Counts the number of cells with numeric values in the range.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=COUNT(E1:E10)</code></p>
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-md font-medium mb-2 text-blue-700">Data Quality Functions</h3>
          <ul className="space-y-2">
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">TRIM(cell)</code>
              <p className="text-sm mt-1">Removes leading and trailing whitespace from a cell.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=TRIM(A1)</code></p>
            </li>
            <li className="border-b pb-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">UPPER(cell)</code>
              <p className="text-sm mt-1">Converts the text in a cell to uppercase.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=UPPER(B1)</code></p>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">LOWER(cell)</code>
              <p className="text-sm mt-1">Converts the text in a cell to lowercase.</p>
              <p className="text-xs text-gray-600 mt-1">Example: <code>=LOWER(C1)</code></p>
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-md font-medium mb-2 text-blue-700">Data Operations</h3>
          <ul className="space-y-2">
            <li className="border-b pb-2">
              <p className="text-sm font-medium">Remove Duplicates</p>
              <p className="text-sm mt-1">Select a range and click the calculator icon in the toolbar to remove duplicate rows.</p>
            </li>
            <li>
              <p className="text-sm font-medium">Find and Replace</p>
              <p className="text-sm mt-1">Click the search icon in the toolbar to open the find and replace dialog.</p>
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-md font-medium mb-2 text-blue-700">Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Start formulas with an equals sign (=)</li>
            <li>• Use cell references (e.g., A1) in formulas</li>
            <li>• For ranges, use the format A1:B5</li>
            <li>• Press Enter to confirm a formula</li>
            <li>• Select multiple cells by clicking and dragging</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FunctionHelp;