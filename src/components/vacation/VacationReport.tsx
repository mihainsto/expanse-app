import { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Fade,
  IconButton,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import type { Vacation } from '../../data/types';
import { getTotalSpent, formatCurrency } from '../../data/loader';
import ExpenseSummaryCards from './ExpenseSummaryCards';
import CategoryPieChart from './CategoryPieChart';
import DailyBarChart from './DailyBarChart';
import SpendingTimeline from './SpendingTimeline';
import CategoryBreakdown from './CategoryBreakdown';
import DayByDayTable from './DayByDayTable';
import BudgetInsights from './BudgetInsights';

const DESTINATION_GRADIENTS: Record<string, string> = {
  Morocco: 'linear-gradient(135deg, #E65100 0%, #FF8F00 40%, #FFD54F 100%)',
  default: 'linear-gradient(135deg, #00897B 0%, #26A69A 50%, #80CBC4 100%)',
};

interface Props {
  vacations: Vacation[];
}

export default function VacationReport({ vacations }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vacation = useMemo(
    () => vacations.find((v) => v.id === id),
    [vacations, id]
  );

  if (!vacation) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Vacation not found
        </Typography>
      </Box>
    );
  }

  const startDate = new Date(vacation.startDate);
  const endDate = new Date(vacation.endDate);
  const days = differenceInDays(endDate, startDate);
  const total = getTotalSpent(vacation);
  const gradient =
    DESTINATION_GRADIENTS[vacation.destination] ?? DESTINATION_GRADIENTS.default;

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Hero Header */}
        <Box
          sx={{
            background: gradient,
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            mb: 4,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -40,
              left: '60%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ color: '#fff', mb: 1, ml: -1 }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}
            >
              {vacation.title}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }} useFlexGap>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{vacation.destination}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  {format(startDate, 'MMM d')} – {format(endDate, 'MMM d, yyyy')}
                </Typography>
              </Box>
              <Chip
                label={`${days} days`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Stack>

            <Typography variant="h5" sx={{ fontWeight: 700, opacity: 0.95 }}>
              {formatCurrency(total, vacation.currency)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              total spent across {vacation.expenses.length} transactions
            </Typography>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ mb: 4 }}>
          <ExpenseSummaryCards vacation={vacation} />
        </Box>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <CategoryPieChart vacation={vacation} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SpendingTimeline vacation={vacation} />
          </Grid>
        </Grid>

        {/* Daily Bar Chart */}
        <Box sx={{ mb: 4 }}>
          <DailyBarChart vacation={vacation} />
        </Box>

        {/* Insights */}
        <Box sx={{ mb: 4 }}>
          <BudgetInsights vacation={vacation} />
        </Box>

        {/* Category Breakdown */}
        <Box sx={{ mb: 4 }}>
          <CategoryBreakdown vacation={vacation} />
        </Box>

        {/* Transaction Table */}
        <Box sx={{ mb: 4 }}>
          <DayByDayTable vacation={vacation} />
        </Box>
      </Box>
    </Fade>
  );
}
