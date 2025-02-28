// Mathematical Functions
export const SUM = (values: (number | string)[]): number => {
  return values
    .map(val => Number(val))
    .filter(val => !isNaN(val))
    .reduce((sum, val) => sum + val, 0);
};


export const AVERAGE = (values: (number | string)[]): number => {
  const numericValues = values.filter(val => !isNaN(Number(val)));
  if (numericValues.length === 0) return 0;
  return SUM(numericValues) / numericValues.length;
};

export const MAX = (values: (number | string)[]): number => {
  const numericValues = values
    .filter(val => !isNaN(Number(val)))
    .map(val => Number(val));
  if (numericValues.length === 0) return 0;
  return Math.max(...numericValues);
};

export const MIN = (values: (number | string)[]): number => {
  const numericValues = values
    .filter(val => !isNaN(Number(val)))
    .map(val => Number(val));
  if (numericValues.length === 0) return 0;
  return Math.min(...numericValues);
};

export const COUNT = (values: (number | string)[]): number => {
  return values.filter(val => !isNaN(Number(val))).length;
};

// Data Quality Functions
export const TRIM = (value: string): string => {
  return value.trim();
};

export const UPPER = (value: string): string => {
  return value.toUpperCase();
};

export const LOWER = (value: string): string => {
  return value.toLowerCase();
};

// Helper function to parse cell references like A1:B5
export const parseCellRange = (range: string): { startCol: string; startRow: number; endCol: string; endRow: number } => {
  const [start, end] = range.split(':');
  
  const startCol = start.replace(/[0-9]/g, '');
  const startRow = parseInt(start.replace(/[A-Z]/g, ''));
  
  const endCol = end.replace(/[0-9]/g, '');
  const endRow = parseInt(end.replace(/[A-Z]/g, ''));
  
  return { startCol, startRow, endCol, endRow };
};

// Data validation
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== '';
};

export const isDate = (value: string): boolean => {
  return !isNaN(Date.parse(value));
};

export const formatDate = (value: string): string => {
  try {
    const date = new Date(value);
    return date.toLocaleDateString();
  } catch (e) {
    return value;
  }
};