export interface Category {
  id: string;
  name: string;
  limit: number | null;
  createdAt: number;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  note: string;
  date: string;
  createdAt: number;
}

export interface Totals {
  income: number;
  expense: number;
}

export interface CatSpend {
  category: Category;
  spent: number;
  percent: number;
  overLimit: boolean;
}