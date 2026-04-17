import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { format } from 'date-fns';
import type { Vacation } from '../../data/types';
import { getDailySummaries, formatCurrency, getDurationDays } from '../../data/loader';

interface InsightItem {
  label: string;
  value: string;
  detail?: string;
  icon: React.ReactElement;
  color: string;
}

interface Props {
  vacation: Vacation;
}

export default function BudgetInsights({ vacation }: Props) {
  const daily = getDailySummaries(vacation);
  const days = getDurationDays(vacation);

  const mostExpensiveDay = daily.reduce((max, d) => (d.total > max.total ? d : max), daily[0]);
  const cheapestDay = daily.reduce((min, d) => (d.total < min.total ? d : min), daily[0]);
  const biggestExpense = vacation.expenses.reduce((max, e) => (e.amount > max.amount ? e : max), vacation.expenses[0]);

  const foodExpenses = vacation.expenses.filter((e) => e.category === 'food');
  const totalFood = foodExpenses.reduce((s, e) => s + e.amount, 0);
  const avgFoodPerDay = days > 0 ? totalFood / days : 0;

  const fuelExpenses = vacation.expenses.filter(
    (e) => e.category === 'transport' && e.description.toLowerCase().includes('diesel')
  );
  const totalFuel = fuelExpenses.reduce((s, e) => s + e.amount, 0);

  const accommodationTotal = vacation.expenses
    .filter((e) => e.category === 'accommodation')
    .reduce((s, e) => s + e.amount, 0);
  const avgAccomPerNight = days > 0 ? accommodationTotal / days : 0;

  const insights: InsightItem[] = [
    {
      label: 'Biggest Single Expense',
      value: formatCurrency(biggestExpense.amount, vacation.currency),
      detail: biggestExpense.description,
      icon: <EmojiEventsIcon />,
      color: '#E65100',
    },
    {
      label: 'Most Expensive Day',
      value: formatCurrency(mostExpensiveDay.total, vacation.currency),
      detail: format(new Date(mostExpensiveDay.date), 'EEEE, MMM d'),
      icon: <TrendingUpIcon />,
      color: '#E53935',
    },
    {
      label: 'Cheapest Day',
      value: formatCurrency(cheapestDay.total, vacation.currency),
      detail: format(new Date(cheapestDay.date), 'EEEE, MMM d'),
      icon: <TrendingDownIcon />,
      color: '#43A047',
    },
    {
      label: 'Avg. Food Per Day',
      value: formatCurrency(Math.round(avgFoodPerDay), vacation.currency),
      detail: `${foodExpenses.length} food expenses total`,
      icon: <RestaurantIcon />,
      color: '#FB8C00',
    },
    {
      label: 'Total Fuel Cost',
      value: formatCurrency(totalFuel, vacation.currency),
      detail: `${fuelExpenses.length} fill-ups`,
      icon: <LocalGasStationIcon />,
      color: '#1E88E5',
    },
    {
      label: 'Avg. Accommodation / Night',
      value: formatCurrency(Math.round(avgAccomPerNight), vacation.currency),
      detail: `${accommodationTotal.toLocaleString('ro-RO')} ${vacation.currency} total`,
      icon: <NightsStayIcon />,
      color: '#8E24AA',
    },
  ];

  const theme = useTheme();

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Trip Insights
        </Typography>
        <Grid container spacing={2}>
          {insights.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  border: 1,
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      bgcolor: `${item.color}15`,
                      color: item.color,
                      borderRadius: 2,
                      p: 0.75,
                      display: 'flex',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
                {item.detail && (
                  <Typography variant="caption" color="text.secondary">
                    {item.detail}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
