import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

interface Player {
  playerId: number;
  name: string;
  currentTeam?: string;
  position?: string;
  headshot?: string;
}

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayers: Player[];
  onPlayersChange: (players: Player[]) => void;
  maxPlayers: number;
}

const PlayerSelector = ({
  players,
  selectedPlayers,
  onPlayersChange,
  maxPlayers
}: PlayerSelectorProps) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');

  const handlePlayerAdd = (player: Player | null) => {
    if (!player) return;
    if (selectedPlayers.length >= maxPlayers) return;
    if (selectedPlayers.some(p => p.playerId === player.playerId)) return;
    onPlayersChange([...selectedPlayers, player]);
    setInputValue('');
  };

  const handlePlayerRemove = (playerId: number) => {
    onPlayersChange(selectedPlayers.filter(p => p.playerId !== playerId));
  };

  const handleRandomize = () => {
    const availablePlayers = players.filter(
      p => !selectedPlayers.some(sp => sp.playerId === p.playerId)
    );
    const randomPlayers = [...availablePlayers]
      .sort(() => Math.random() - 0.5)
      .slice(0, maxPlayers - selectedPlayers.length);
    onPlayersChange([...selectedPlayers, ...randomPlayers]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Select Players to Compare
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRandomize}
            disabled={selectedPlayers.length >= maxPlayers}
          >
            Randomize
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Autocomplete
            value={null}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            onChange={(_, newValue) => handlePlayerAdd(newValue)}
            options={players.filter(
              p => !selectedPlayers.some(sp => sp.playerId === p.playerId)
            )}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search players"
                placeholder="Type to search..."
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {option.headshot && (
                  <Box
                    component="img"
                    src={option.headshot}
                    alt={option.name}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <Box>
                  <Typography>{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.currentTeam || 'No Team'} • {option.position || 'No Position'}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedPlayers.map((player) => (
            <Chip
              key={player.playerId}
              label={player.name}
              onDelete={() => handlePlayerRemove(player.playerId)}
              sx={{
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            />
          ))}
        </Box>

        {selectedPlayers.length < 2 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Select at least 2 players to compare
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default PlayerSelector; 