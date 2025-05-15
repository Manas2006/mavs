import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import BigBoard from './pages/BigBoard';
import PlayerProfile from './pages/PlayerProfile';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0053B3', // Mavericks blue
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<BigBoard />} />
            <Route path="player/:id" element={<PlayerProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
