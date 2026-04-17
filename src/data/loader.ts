import type { VacationsData, Vacation, CategorySummary, DailySummary, Category } from './types';

let cachedData: VacationsData | null = null;

export async function loadVacations(): Promise<VacationsData> {
  if (cachedData) return cachedData;
  const response = await fetch('/data/vacations.json');
  cachedData = await response.json();
  return cachedData!;
}

export function getTotalSpent(vacation: Vacation): number {
  return vacation.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getDurationDays(vacation: Vacation): number {
  const start = new Date(vacation.startDate);
  const end = new Date(vacation.endDate);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDailyAverage(vacation: Vacation): number {
  const days = getDurationDays(vacation);
  return days > 0 ? getTotalSpent(vacation) / days : 0;
}

export function getCategorySummaries(vacation: Vacation): CategorySummary[] {
  const total = getTotalSpent(vacation);
  const map = new Map<Category, { total: number; count: number }>();

  for (const expense of vacation.expenses) {
    const entry = map.get(expense.category) ?? { total: 0, count: 0 };
    entry.total += expense.amount;
    entry.count += 1;
    map.set(expense.category, entry);
  }

  return Array.from(map.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      percentage: total > 0 ? (data.total / total) * 100 : 0,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getTopCategory(vacation: Vacation): CategorySummary {
  return getCategorySummaries(vacation)[0];
}

export function getDailySummaries(vacation: Vacation): DailySummary[] {
  const map = new Map<string, DailySummary>();

  for (const expense of vacation.expenses) {
    const entry = map.get(expense.date) ?? {
      date: expense.date,
      total: 0,
      byCategory: {},
    };
    entry.total += expense.amount;
    entry.byCategory[expense.category] =
      (entry.byCategory[expense.category] ?? 0) + expense.amount;
    map.set(expense.date, entry);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getCumulativeSpending(vacation: Vacation): { date: string; cumulative: number }[] {
  const daily = getDailySummaries(vacation);
  let cumulative = 0;
  return daily.map((d) => {
    cumulative += d.total;
    return { date: d.date, cumulative };
  });
}

export function formatCurrency(amount: number, currency: string): string {
  return `${amount.toLocaleString('ro-RO')} ${currency}`;
}
