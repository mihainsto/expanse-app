import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';
import type { Vacation } from '../../data/types';
import { formatCurrency, getDailySummaries } from '../../data/loader';
import { getCategoryLabel } from '../common/CategoryIcon';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

export default function DayByDayTable({ vacation }: Props) {
  const dailySummaries = getDailySummaries(vacation);

  const groupedByDate = new Map<string, typeof vacation.expenses>();
  for (const expense of vacation.expenses) {
    const list = groupedByDate.get(expense.date) ?? [];
    list.push(expense);
    groupedByDate.set(expense.date, list);
  }

  const sortedDates = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          All Transactions
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDates.map((date) => {
                const expenses = groupedByDate.get(date)!;
                const dailyTotal = dailySummaries.find((d) => d.date === date)?.total ?? 0;

                return [
                  ...expenses.map((e, idx) => (
                    <TableRow
                      key={e.id}
                      sx={{
                        bgcolor: idx % 2 === 0 ? 'transparent' : 'action.hover',
                      }}
                    >
                      {idx === 0 ? (
                        <TableCell
                          rowSpan={expenses.length}
                          sx={{
                            fontWeight: 600,
                            verticalAlign: 'top',
                            borderRight: 1,
                            borderColor: 'divider',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {format(new Date(date), 'EEE')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(date), 'MMM d')}
                          </Typography>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(e.category)}
                          size="small"
                          sx={{
                            bgcolor: `${CATEGORY_COLORS[e.category]}18`,
                            color: CATEGORY_COLORS[e.category],
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{e.description}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatCurrency(e.amount, vacation.currency)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )),
                  <TableRow key={`${date}-subtotal`}>
                    <TableCell
                      colSpan={3}
                      sx={{ borderBottom: 2, borderColor: 'divider' }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: 'text.secondary' }}
                        >
                          Day Total
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ borderBottom: 2, borderColor: 'divider' }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatCurrency(dailyTotal, vacation.currency)}
                      </Typography>
                    </TableCell>
                  </TableRow>,
                ];
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
