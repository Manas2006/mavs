import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState, useMemo } from 'react';
import MainLayout from './layouts/MainLayout';
import BigBoard from './pages/BigBoard';
import PlayerProfile from './pages/PlayerProfile';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#0053BC' : '#90caf9',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212',
      paper: mode === 'light' ? '#fff' : '#1a1a1a',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout mode={mode} toggleMode={toggleMode} />}>
            <Route index element={<HomePage />} />
            <Route path="big-board" element={<BigBoard />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="player/:id" element={<PlayerProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
