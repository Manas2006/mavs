import { Avatar, Paper, useTheme, useMediaQuery } from '@mui/material';
import React from 'react';

interface PlayerPhotoCardProps {
  name: string;
  photoUrl?: string;
}

const PlayerPhotoCard: React.FC<PlayerPhotoCardProps> = ({ name, photoUrl }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper
      elevation={2}
      sx={{
        p: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: isMobile ? 260 : 400,
        maxWidth: isMobile ? 260 : 380,
        width: '100%',
        borderRadius: 3,
        boxSizing: 'border-box',
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          style={{
            width: '100%',
            maxWidth: isMobile ? 200 : 320,
            maxHeight: isMobile ? 220 : 340,
            aspectRatio: '1/1',
            objectFit: 'contain',
            borderRadius: 12,
            display: 'block',
            background: '#f3f3f3',
          }}
        />
      ) : (
        <Avatar sx={{ width: isMobile ? 120 : 220, height: isMobile ? 120 : 220, bgcolor: 'grey.300', fontSize: isMobile ? 40 : 80, color: 'text.primary', fontWeight: 700 }}>
          {name ? name[0] : ''}
        </Avatar>
      )}
    </Paper>
  );
};

export default PlayerPhotoCard; 