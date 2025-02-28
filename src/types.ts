export interface CellData {
  value: string;
  formula: string;
  style: CellStyle;
  dataType?: 'number' | 'date' | 'text';
}

export interface CellStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
}

export interface SpreadsheetState {
  data: Record<string, Record<string, CellData>>;
  activeCell: { row: number; col: string } | null;
  selectedRange: {
    start: { row: number; col: string };
    end: { row: number; col: string };
  } | null;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
  editMode: boolean;
  formulaBarValue: string;
  findReplaceOpen: boolean;
  findValue: string;
  replaceValue: string;
  
  // Actions
  setActiveCell: (row: number, col: string) => void;
  updateCellValue: (row: number, col: string, value: string, isFormula?: boolean) => void;
  updateCellStyle: (row: number, col: string, style: Partial<CellStyle>) => void;
  setEditMode: (editing: boolean) => void;
  setFormulaBarValue: (value: string) => void;
  evaluateFormula: (formula: string, row: number, col: string) => string;
  setSelectedRange: (start: { row: number; col: string }, end: { row: number; col: string }) => void;
  removeDuplicates: () => void;
  setFindReplaceOpen: (open: boolean) => void;
  setFindValue: (value: string) => void;
  setReplaceValue: (value: string) => void;
  findAndReplace: () => void;
}