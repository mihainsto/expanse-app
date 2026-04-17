import { Grid } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TodayIcon from '@mui/icons-material/Today';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { Vacation } from '../../data/types';
import {
  getTotalSpent,
  getDailyAverage,
  getTopCategory,
  formatCurrency,
} from '../../data/loader';
import { getCategoryLabel } from '../common/CategoryIcon';
import StatCard from '../common/StatCard';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

export default function ExpenseSummaryCards({ vacation }: Props) {
  const total = getTotalSpent(vacation);
  const avg = getDailyAverage(vacation);
  const top = getTopCategory(vacation);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Spent"
          value={formatCurrency(total, vacation.currency)}
          icon={<AccountBalanceWalletIcon />}
          color="#E65100"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Daily Average"
          value={formatCurrency(Math.round(avg), vacation.currency)}
          subtitle="per day"
          icon={<TodayIcon />}
          color="#1E88E5"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Top Category"
          value={getCategoryLabel(top.category)}
          subtitle={`${formatCurrency(top.total, vacation.currency)} (${top.percentage.toFixed(1)}%)`}
          icon={<CategoryIcon />}
          color={CATEGORY_COLORS[top.category]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Transactions"
          value={String(vacation.expenses.length)}
          icon={<ReceiptLongIcon />}
          color="#43A047"
        />
      </Grid>
    </Grid>
  );
}
