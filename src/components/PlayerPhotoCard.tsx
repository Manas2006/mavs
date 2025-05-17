import { Avatar, Paper } from '@mui/material';
import React from 'react';

interface PlayerPhotoCardProps {
  name: string;
  photoUrl?: string;
}

const PlayerPhotoCard: React.FC<PlayerPhotoCardProps> = ({ name, photoUrl }) => (
  <Paper elevation={2} sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340, borderRadius: 3 }}>
    {photoUrl ? (
      <img
        src={photoUrl}
        alt={name}
        style={{ width: '100%', maxWidth: 320, aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12 }}
      />
    ) : (
      <Avatar sx={{ width: 220, height: 220, bgcolor: 'grey.300', fontSize: 80, color: 'text.primary', fontWeight: 700 }}>
        {name ? name[0] : ''}
      </Avatar>
    )}
  </Paper>
);

export default PlayerPhotoCard; 