import { Card, CardContent, Typography, useTheme, Box, Chip } from '@mui/material';
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
import RouteIcon from '@mui/icons-material/Route';
import type { Vacation, Category, ItineraryDay } from '../../data/types';
import { getDailySummaries, formatCurrency } from '../../data/loader';
import { getCategoryLabel } from '../common/CategoryIcon';
import { CATEGORY_COLORS } from '../../theme/theme';

interface Props {
  vacation: Vacation;
}

interface ChartDatum {
  date: string;
  dateRaw: string;
  km?: number;
  from?: string;
  to?: string;
  [category: string]: number | string | undefined;
}

export default function DailyBarChart({ vacation }: Props) {
  const daily = getDailySummaries(vacation);
  const theme = useTheme();

  const itineraryByDate = new Map<string, ItineraryDay>(
    (vacation.itinerary ?? []).map((leg) => [leg.date, leg])
  );

  const allCategories = Array.from(
    new Set(vacation.expenses.map((e) => e.category))
  ) as Category[];

  const chartData: ChartDatum[] = daily.map((d) => {
    const leg = itineraryByDate.get(d.date);
    return {
      date: format(new Date(d.date), 'MMM d'),
      dateRaw: d.date,
      km: leg?.km,
      from: leg?.from,
      to: leg?.to,
      ...d.byCategory,
    };
  });

  const totalKm = (vacation.itinerary ?? []).reduce((sum, leg) => sum + leg.km, 0);
  const avgKm = vacation.itinerary && vacation.itinerary.length > 0
    ? Math.round(totalKm / vacation.itinerary.length)
    : 0;
  const hasItinerary = totalKm > 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDateTick = (props: any) => {
    const x = Number(props?.x ?? 0);
    const y = Number(props?.y ?? 0);
    const payload = props?.payload as { value: string; index: number } | undefined;
    if (!payload) return <g />;
    const datum = chartData[payload.index];
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={14}
          textAnchor="middle"
          fill={theme.palette.text.secondary}
          fontSize={12}
        >
          {payload.value}
        </text>
        {datum?.km !== undefined && (
          <text
            x={0}
            y={0}
            dy={30}
            textAnchor="middle"
            fill={theme.palette.text.disabled}
            fontSize={10}
            fontWeight={600}
          >
            {datum.km} km
          </text>
        )}
      </g>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTooltip = (props: any) => {
    if (!props?.active || !props?.payload || props.payload.length === 0) return null;
    const payload = props.payload as ReadonlyArray<{
      name?: string | number;
      value?: number;
      payload?: ChartDatum;
    }>;
    const datum = payload[0].payload as ChartDatum | undefined;
    const total = payload.reduce(
      (sum, entry) => sum + Number(entry.value ?? 0),
      0
    );
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          p: 1.5,
          minWidth: 220,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {datum?.dateRaw
            ? format(new Date(datum.dateRaw), 'EEE, MMM d')
            : props.label}
        </Typography>
        {datum?.from && datum?.to && (
          <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25 }}>
            {datum.from} → {datum.to}
            {datum.km !== undefined && (
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, fontWeight: 600 }}
              >
                {datum.km} km
              </Typography>
            )}
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {payload.map((entry) => {
            const cat = String(entry.name) as Category;
            const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
            return (
              <Box
                key={cat}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  fontSize: 12,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: color }}
                  />
                  <Typography variant="caption">{getCategoryLabel(cat)}</Typography>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatCurrency(Number(entry.value ?? 0), vacation.currency)}
                </Typography>
              </Box>
            );
          })}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: 1,
              borderColor: 'divider',
              pt: 0.5,
              mt: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Day total
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {formatCurrency(total, vacation.currency)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="h6">Daily Spending Breakdown</Typography>
          {hasItinerary && (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={<RouteIcon sx={{ fontSize: 16 }} />}
                label={`${totalKm.toLocaleString('ro-RO')} km total`}
                size="small"
                sx={{
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`~${avgKm} km/day`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </Box>
        <ResponsiveContainer width="100%" height={hasItinerary ? 380 : 350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: hasItinerary ? 24 : 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={hasItinerary ? renderDateTick : { fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              height={hasItinerary ? 44 : 30}
              interval={0}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={renderTooltip}
              cursor={{ fill: theme.palette.action.hover }}
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
