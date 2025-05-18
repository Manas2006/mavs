import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const PulsingButton = styled(motion(Link))`
  padding: 12px 32px;
  margin-top: 32px;
  border-radius: 9999px;
  font-weight: 600;
  background-color: #0053BC;
  color: white;
  box-shadow: 0 0 0 0 rgba(0, 83, 188, 0.7);
  transition: all 0.3s ease;
  text-decoration: none;
  letter-spacing: 0.05em;

  &:hover {
    background-color: #004494;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 83, 188, 0.4);
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(0, 83, 188, 0.7);
    }
    70% {
      transform: scale(1.06);
      box-shadow: 0 0 0 12px rgba(0, 83, 188, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(0, 83, 188, 0);
    }
  }

  animation: pulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;

const HomePage = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
        pb: 0,
        mt: { xs: -16, md: -20 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/logo.svg" 
          alt="Mavs Logo" 
          style={{ 
            height: 120, 
            marginBottom: 24,
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
          }} 
        />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '3rem', md: '4.5rem' },
            letterSpacing: '0.1em',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            mb: 1
          }}
        >
          MAVERICKS
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '0.1em',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            mb: 4
          }}
        >
          DRAFT HUB
        </Typography>
        <PulsingButton to="/big-board">
          Get Started
        </PulsingButton>
      </motion.div>
    </Box>
  );
};

export default HomePage; 