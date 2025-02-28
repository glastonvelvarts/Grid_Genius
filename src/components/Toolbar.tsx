import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, PaintBucket, Save, FileUp, FileDown, Plus, Trash,
  Search, Calculator
} from 'lucide-react';
import { useSpreadsheetStore } from '../store';
import FindReplaceDialog from './FindReplaceDialog';

const Toolbar: React.FC = () => {
  const { 
    activeCell, 
    updateCellStyle, 
    data, 
    setFindReplaceOpen, 
    findReplaceOpen,
    removeDuplicates,
    selectedRange
  } = useSpreadsheetStore();
  
  const handleStyleChange = (styleProperty: string, value: any) => {
    if (!activeCell) return;
    
    updateCellStyle(activeCell.row, activeCell.col, { [styleProperty]: value });
  };
  
  const getActiveStyle = (styleProperty: string) => {
    if (!activeCell) return null;
    
    const cellStyle = data[activeCell.row]?.[activeCell.col]?.style;
    return cellStyle ? cellStyle[styleProperty as keyof typeof cellStyle] : null;
  };
  
  const isActive = (styleProperty: string, value: any) => {
    return getActiveStyle(styleProperty) === value;
  };
  
  const buttonClass = "p-2 rounded hover:bg-gray-200 transition-colors";
  const activeButtonClass = "p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors";
  const disabledButtonClass = "p-2 rounded text-gray-400 cursor-not-allowed";
  
  const handleRemoveDuplicates = () => {
    if (selectedRange) {
      removeDuplicates();
    }
  };
  
  return (
    <>
      <div className="flex items-center gap-1 p-1 border-b bg-white">
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button className={buttonClass} title="New Sheet">
            <Plus size={16} />
          </button>
          <button className={buttonClass} title="Save">
            <Save size={16} />
          </button>
          <button className={buttonClass} title="Import">
            <FileUp size={16} />
          </button>
          <button className={buttonClass} title="Export">
            <FileDown size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button 
            className={isActive('bold', true) ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('bold', !getActiveStyle('bold'))}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            className={isActive('italic', true) ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('italic', !getActiveStyle('italic'))}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            className={isActive('underline', true) ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('underline', !getActiveStyle('underline'))}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button 
            className={isActive('align', 'left') ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('align', 'left')}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button 
            className={isActive('align', 'center') ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('align', 'center')}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button 
            className={isActive('align', 'right') ? activeButtonClass : buttonClass}
            onClick={() => handleStyleChange('align', 'right')}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 border-r pr-2 mr-2">
          <div className="flex items-center gap-1">
            <Type size={16} className="text-gray-500" />
            <input 
              type="color" 
              value={getActiveStyle('textColor') as string || '#000000'} 
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-6 h-6 p-0 border-0"
              title="Text Color"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <PaintBucket size={16} className="text-gray-500" />
            <input 
              type="color" 
              value={getActiveStyle('backgroundColor') as string || '#ffffff'} 
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-6 h-6 p-0 border-0"
              title="Background Color"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button 
            className={buttonClass}
            onClick={() => setFindReplaceOpen(true)}
            title="Find and Replace"
          >
            <Search size={16} />
          </button>
          <button 
            className={selectedRange ? buttonClass : disabledButtonClass}
            onClick={handleRemoveDuplicates}
            disabled={!selectedRange}
            title="Remove Duplicates"
          >
            <Calculator size={16} />
          </button>
        </div>
        
        <div className="ml-auto">
          <button className={buttonClass} title="Delete Cell">
            <Trash size={16} />
          </button>
        </div>
      </div>
      
      {findReplaceOpen && <FindReplaceDialog />}
    </>
  );
};

export default Toolbar;