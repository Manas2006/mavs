import { AppBar, Toolbar, Typography, Container, Box, Switch, useTheme, FormControlLabel } from '@mui/material';
import { Outlet, NavLink } from 'react-router-dom';
import React from 'react';

interface MainLayoutProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ mode, toggleMode }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1} sx={{ minHeight: 80, justifyContent: 'center' }}>
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 4 }, justifyContent: 'flex-start', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <img src="/logo.svg" alt="Mavs Logo" style={{ height: 48, marginRight: 16 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1, color: theme.palette.primary.main, fontSize: { xs: '1.5rem', md: '2.2rem' }, pr: 3 }}>
              Mavericks Draft Hub
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            <NavLink to="/" end style={({ isActive }) => ({
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive ? theme.palette.action.hover : 'none',
            })}>
              Home
            </NavLink>
            <NavLink to="/big-board" style={({ isActive }) => ({
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive ? theme.palette.action.hover : 'none',
            })}>
              Big Board
            </NavLink>
            <NavLink to="/compare" style={({ isActive }) => ({
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive ? theme.palette.action.hover : 'none',
            })}>
              Compare Players
            </NavLink>
          </Box>
          <Box sx={{ flex: 1 }} />
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} color="primary" />}
            label={<Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Dark Mode</Typography>}
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1, px: { xs: 1, sm: 2, md: 4 } }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ width: '100%', bgcolor: '#0053BC', py: 2, mt: 'auto' }}>
        <Typography align="center" color="#fff" sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem' }, letterSpacing: 0.5 }}>
          Developed by Manas Pathak — Contact Me
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout; 