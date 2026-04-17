import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Vacation } from '../../data/types';

export const DRAWER_WIDTH = 260;

interface Props {
  vacations: Vacation[];
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ vacations, mobileOpen, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          TripTracker
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 1 }}>
        <ListItemButton
          selected={location.pathname === '/'}
          onClick={() => { navigate('/'); onClose(); }}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>
      <Divider sx={{ mx: 2 }} />
      <Typography variant="overline" sx={{ px: 3, pt: 2, pb: 1, color: 'text.secondary' }}>
        Vacations
      </Typography>
      <List sx={{ px: 1, flex: 1, overflow: 'auto' }}>
        {vacations.map((v) => (
          <ListItemButton
            key={v.id}
            selected={location.pathname === `/vacation/${v.id}`}
            onClick={() => { navigate(`/vacation/${v.id}`); onClose(); }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon><BeachAccessIcon /></ListItemIcon>
            <ListItemText
              primary={v.destination}
              secondary={`${v.startDate.slice(0, 4)}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
