import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Vacation } from '../../data/types';
import { getTotalSpent, getDurationDays, formatCurrency } from '../../data/loader';
import { CATEGORY_COLORS } from '../../theme/theme';
import { getCategorySummaries } from '../../data/loader';

const DESTINATION_GRADIENTS: Record<string, string> = {
  Morocco: 'linear-gradient(135deg, #E65100 0%, #FF8F00 50%, #FFD54F 100%)',
  default: 'linear-gradient(135deg, #00897B 0%, #26A69A 50%, #80CBC4 100%)',
};

interface Props {
  vacation: Vacation;
}

export default function VacationCard({ vacation }: Props) {
  const navigate = useNavigate();
  const total = getTotalSpent(vacation);
  const days = getDurationDays(vacation);
  const categories = getCategorySummaries(vacation);
  const gradient = DESTINATION_GRADIENTS[vacation.destination] ?? DESTINATION_GRADIENTS.default;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/vacation/${vacation.id}`)}>
        <Box
          sx={{
            background: gradient,
            p: 3,
            pb: 4,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.5 }}>
            {format(new Date(vacation.startDate), 'MMM yyyy')}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {vacation.destination}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {vacation.title}
          </Typography>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {days} days
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ReceiptLongIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {vacation.expenses.length} expenses
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {formatCurrency(total, vacation.currency)}
          </Typography>

          {/* Mini category bar */}
          <Box sx={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', mb: 2 }}>
            {categories.map((c) => (
              <Box
                key={c.category}
                sx={{
                  width: `${c.percentage}%`,
                  bgcolor: CATEGORY_COLORS[c.category],
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {vacation.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
