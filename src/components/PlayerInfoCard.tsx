import { Box, Paper, Typography, Avatar, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Player {
  playerId: number;
  name: string;
  currentTeam?: string;
  position?: string;
  height?: number;
  weight?: number;
  headshot?: string;
  photoUrl?: string;
}

interface PlayerInfoCardProps {
  player: Player;
  color: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const PlayerInfoCard = ({ player, color }: PlayerInfoCardProps) => {
  const theme = useTheme();
  const [imgError, setImgError] = useState(false);

  const formatHeight = (height?: number) => {
    if (!height) return 'N/A';
    const feet = Math.floor(height / 12);
    const inches = height % 12;
    return `${feet}'${inches}"`;
  };

  const imageSrc = player.photoUrl || player.headshot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 0 20px ${color}40`,
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: color,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 100,
            height: 100,
            backgroundImage: 'url(/mavs-logo.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: 0.05,
            zIndex: 0
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {!imgError && imageSrc ? (
            <Avatar
              src={imageSrc}
              alt={player.name}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: `3px solid ${color}`,
                boxShadow: `0 0 10px ${color}40`,
                backgroundColor: theme.palette.background.paper,
                objectFit: 'cover',
                fontSize: 48
              }}
              imgProps={{
                onError: () => setImgError(true)
              }}
            />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: `3px solid ${color}`,
                boxShadow: `0 0 10px ${color}40`,
                background: `linear-gradient(135deg, ${color}33 0%, ${theme.palette.background.paper} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                fontWeight: 700,
                color: theme.palette.text.primary,
                filter: 'blur(0.5px)'
              }}
              aria-label={player.name}
            >
              {getInitials(player.name)}
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
            {player.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            {player.currentTeam || 'No Team'} • {player.position || 'No Position'}
          </Typography>
          <Box sx={{ width: '100%', mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Height</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatHeight(player.height)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Weight</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {player.weight ? `${player.weight} lbs` : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default PlayerInfoCard; 