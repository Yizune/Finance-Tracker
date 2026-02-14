export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Settings {
  darkMode: boolean;
}

export interface Category {
  category: string;
}

export type PopupMode = 'add' | 'edit' | 'remove' | null;

export type SortOrder = 'ignore' | 'ascAmount' | 'descAmount';
