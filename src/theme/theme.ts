import { createTheme, type ThemeOptions } from '@mui/material/styles';

const shared: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#00897B' },
    secondary: { main: '#FFB300' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#4DB6AC' },
    secondary: { main: '#FFD54F' },
    background: { default: '#121212', paper: '#1E1E1E' },
  },
});

export const CATEGORY_COLORS: Record<string, string> = {
  transport: '#1E88E5',
  accommodation: '#8E24AA',
  food: '#FB8C00',
  flights: '#00897B',
  insurance: '#43A047',
  activities: '#E53935',
  shopping: '#F06292',
  other: '#78909C',
};
