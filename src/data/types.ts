export type Category =
  | 'flights'
  | 'accommodation'
  | 'food'
  | 'transport'
  | 'insurance'
  | 'activities'
  | 'shopping'
  | 'other';

export interface Expense {
  id: number;
  date: string;
  category: Category;
  description: string;
  amount: number;
}

export interface Vacation {
  id: string;
  title: string;
  destination: string;
  currency: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tags: string[];
  notes?: string;
  expenses: Expense[];
}

export interface VacationsData {
  vacations: Vacation[];
}

export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
  count: number;
}

export interface DailySummary {
  date: string;
  total: number;
  byCategory: Partial<Record<Category, number>>;
}
