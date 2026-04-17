import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import type { Vacation } from '../../data/types';
import { getCategorySummaries, formatCurrency } from '../../data/loader';
import { getCategoryLabel, CategoryAvatar } from '../common/CategoryIcon';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

export default function CategoryBreakdown({ vacation }: Props) {
  const categories = getCategorySummaries(vacation);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Category Breakdown
        </Typography>

        {categories.map((cat) => {
          const expenses = vacation.expenses.filter(
            (e) => e.category === cat.category
          );
          const color = CATEGORY_COLORS[cat.category];

          return (
            <Accordion
              key={cat.category}
              disableGutters
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: '12px !important',
                mb: 1.5,
                '&:before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ px: 2.5, py: 0.5 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    pr: 2,
                  }}
                >
                  <CategoryAvatar category={cat.category} size={36} />
                  <Typography sx={{ fontWeight: 600, flex: 1 }}>
                    {getCategoryLabel(cat.category)}
                  </Typography>
                  <Chip
                    label={`${cat.count} item${cat.count > 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color }}>
                      {formatCurrency(cat.total, vacation.currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: `${color}30`,
                    mb: 1.5,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${cat.percentage}%`,
                      bgcolor: color,
                      borderRadius: 2,
                    }}
                  />
                </Box>
                <List dense disablePadding>
                  {expenses.map((e) => (
                    <ListItem key={e.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={e.description}
                        secondary={format(new Date(e.date), 'EEE, MMM d')}
                        slotProps={{ primary: { variant: 'body2' } }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(e.amount, vacation.currency)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </CardContent>
    </Card>
  );
}
