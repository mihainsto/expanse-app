import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Vacation } from '../../data/types';
import { getCategorySummaries, formatCurrency } from '../../data/loader';
import { getCategoryLabel, CategoryAvatar } from '../common/CategoryIcon';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

export default function CategoryPieChart({ vacation }: Props) {
  const categories = getCategorySummaries(vacation);
  const theme = useTheme();

  const data = categories.map((c) => ({
    name: getCategoryLabel(c.category),
    value: c.total,
    category: c.category,
    percentage: c.percentage,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Spending by Category
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 220, height: 220, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value), vacation.currency)}
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ flex: 1, width: '100%' }}>
            {categories.map((c) => (
              <Box
                key={c.category}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <CategoryAvatar category={c.category} size={32} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getCategoryLabel(c.category)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.count} expense{c.count > 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(c.total, vacation.currency)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
