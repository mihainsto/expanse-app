import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import AppShell from './components/layout/AppShell';
import DashboardPage from './components/dashboard/DashboardPage';
import VacationReport from './components/vacation/VacationReport';
import type { Vacation } from './data/types';
import { loadVacations } from './data/loader';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVacations().then((data) => {
      setVacations(data.vacations);
      setLoading(false);
    });
  }, []);

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route
            element={
              <AppShell
                vacations={vacations}
                onToggleTheme={() => setDarkMode((prev) => !prev)}
              />
            }
          >
            <Route index element={<DashboardPage vacations={vacations} />} />
            <Route path="vacation/:id" element={<VacationReport vacations={vacations} />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
