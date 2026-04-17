import { Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import type { Vacation, Category } from '../../data/types';
import { getDailySummaries, formatCurrency } from '../../data/loader';
import { getCategoryLabel } from '../common/CategoryIcon';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

export default function DailyBarChart({ vacation }: Props) {
  const daily = getDailySummaries(vacation);
  const theme = useTheme();

  const allCategories = Array.from(
    new Set(vacation.expenses.map((e) => e.category))
  ) as Category[];

  const chartData = daily.map((d) => ({
    date: format(new Date(d.date), 'MMM d'),
    ...d.byCategory,
  }));

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Daily Spending Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(Number(value), vacation.currency),
                getCategoryLabel(String(name) as Category),
              ]}
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            />
            <Legend
              formatter={(value: string) => getCategoryLabel(value as Category)}
              wrapperStyle={{ fontSize: 12 }}
            />
            {allCategories.map((cat) => (
              <Bar
                key={cat}
                dataKey={cat}
                stackId="a"
                fill={CATEGORY_COLORS[cat]}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
