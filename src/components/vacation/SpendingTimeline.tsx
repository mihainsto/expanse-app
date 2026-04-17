import { Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { Vacation } from '../../data/types';
import { getCumulativeSpending, formatCurrency } from '../../data/loader';

interface Props {
  vacation: Vacation;
}

export default function SpendingTimeline({ vacation }: Props) {
  const data = getCumulativeSpending(vacation);
  const theme = useTheme();

  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'MMM d'),
    cumulative: d.cumulative,
  }));

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Cumulative Spending
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          How your expenses accumulated over the trip
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value), vacation.currency),
                'Total Spent',
              ]}
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              fill="url(#colorCumulative)"
              dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
