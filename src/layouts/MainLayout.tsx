import { AppBar, Toolbar, Typography, Container, Box, Switch, useTheme, FormControlLabel } from '@mui/material';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import React from 'react';

interface MainLayoutProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ mode, toggleMode }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAppPage = !isHome; // All non-home routes

  // Determine navbar colors based on mode
  const navbarBg = isHome ? 'transparent' : (mode === 'dark' ? '#0d0d0d' : '#ffffff');
  const navbarText = isHome ? '#fff' : (mode === 'dark' ? '#fff' : '#000');
  const navbarHover = isHome ? 'rgba(255,255,255,0.08)' : (mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)');

  return (
    <div
      className={
        isHome
          ? 'bg-mavs-hero min-h-screen flex flex-col'
          : 'bg-court min-h-screen flex flex-col'
      }
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={isHome ? 0 : 1}
        sx={{
          minHeight: 80,
          justifyContent: 'center',
          background: navbarBg,
          boxShadow: isHome ? 'none' : undefined,
          backdropFilter: isHome ? 'blur(4px)' : undefined,
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 4 }, justifyContent: 'flex-start', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <img src="/logo.svg" alt="Mavs Logo" style={{ height: 48, marginRight: 16 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1, color: isHome ? '#fff' : theme.palette.primary.main, fontSize: { xs: '1.5rem', md: '2.2rem' }, pr: 3 }}>
              Mavericks Draft Hub
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            <NavLink to="/" end style={({ isActive }) => ({
              color: isHome ? '#fff' : (isActive ? theme.palette.primary.main : navbarText),
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive && isHome ? navbarHover : (isActive ? navbarHover : 'none'),
              '&:hover': {
                background: navbarHover,
              }
            })}>
              Home
            </NavLink>
            <NavLink to="/big-board" style={({ isActive }) => ({
              color: isHome ? '#fff' : (isActive ? theme.palette.primary.main : navbarText),
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive && isHome ? navbarHover : (isActive ? navbarHover : 'none'),
              '&:hover': {
                background: navbarHover,
              }
            })}>
              Big Board
            </NavLink>
            <NavLink to="/compare" style={({ isActive }) => ({
              color: isHome ? '#fff' : (isActive ? theme.palette.primary.main : navbarText),
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '1.15rem',
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              background: isActive && isHome ? navbarHover : (isActive ? navbarHover : 'none'),
              '&:hover': {
                background: navbarHover,
              }
            })}>
              Compare Players
            </NavLink>
          </Box>
          <Box sx={{ flex: 1 }} />
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} color="primary" />}
            label={<Typography sx={{ fontWeight: 600, fontSize: '1rem', color: isHome ? '#fff' : navbarText }}>Dark Mode</Typography>}
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        sx={{
          mt: 4,
          mb: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 1, sm: 2, md: 4 }
        }}
      >
        <Outlet />
      </Container>
      <Box component="footer" sx={{ width: '100%', bgcolor: isHome ? 'transparent' : '#0053BC', py: 2, mt: 'auto', position: 'relative', zIndex: 1 }}>
        <Typography align="center" color="#fff" sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.1rem' }, letterSpacing: 0.5 }}>
          Developed by Manas Pathak — Contact Me
        </Typography>
      </Box>
    </div>
  );
};

export default MainLayout; 