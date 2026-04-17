import { Box, Typography, Grid, Fade } from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import type { Vacation } from '../../data/types';
import { getTotalSpent, formatCurrency } from '../../data/loader';
import VacationCard from './VacationCard';
import StatCard from '../common/StatCard';

interface Props {
  vacations: Vacation[];
}

export default function DashboardPage({ vacations }: Props) {
  const totalLifetime = vacations.reduce((s, v) => s + getTotalSpent(v), 0);
  const destinations = new Set(vacations.map((v) => v.destination)).size;

  return (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Overview of all your vacation expenses
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Total Vacations"
              value={String(vacations.length)}
              icon={<LuggageIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Lifetime Spending"
              value={formatCurrency(totalLifetime, 'RON')}
              icon={<AccountBalanceWalletIcon />}
              color="#E65100"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="Destinations"
              value={String(destinations)}
              icon={<PublicIcon />}
              color="#1E88E5"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Your Adventures
        </Typography>

        <Grid container spacing={3}>
          {vacations.map((v) => (
            <Grid key={v.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <VacationCard vacation={v} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
}
