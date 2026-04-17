import React from 'react';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar } from '@mui/material';
import { CATEGORY_COLORS } from '../../theme/theme';
import type { Category } from '../../data/types';

const ICON_MAP: Record<Category, React.ReactElement> = {
  flights: <FlightTakeoffIcon fontSize="small" />,
  accommodation: <HotelIcon fontSize="small" />,
  food: <RestaurantIcon fontSize="small" />,
  transport: <DirectionsCarIcon fontSize="small" />,
  insurance: <HealthAndSafetyIcon fontSize="small" />,
  activities: <LocalActivityIcon fontSize="small" />,
  shopping: <ShoppingBagIcon fontSize="small" />,
  other: <MoreHorizIcon fontSize="small" />,
};

const CATEGORY_LABELS: Record<Category, string> = {
  flights: 'Flights',
  accommodation: 'Accommodation',
  food: 'Food & Dining',
  transport: 'Transport',
  insurance: 'Insurance',
  activities: 'Activities',
  shopping: 'Shopping',
  other: 'Other',
};

interface Props {
  category: Category;
  size?: number;
}

export function CategoryAvatar({ category, size = 36 }: Props) {
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;
  return (
    <Avatar sx={{ bgcolor: `${color}20`, color, width: size, height: size }}>
      {ICON_MAP[category] ?? ICON_MAP.other}
    </Avatar>
  );
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category] ?? 'Other';
}

export function getCategoryIcon(category: Category): React.ReactElement {
  return ICON_MAP[category] ?? ICON_MAP.other;
}
