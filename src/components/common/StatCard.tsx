import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactElement;
  color?: string;
}

export default function StatCard({ title, value, subtitle, icon, color }: Props) {
  const theme = useTheme();
  const accent = color ?? theme.palette.primary.main;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: accent }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${accent}15`,
              color: accent,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
