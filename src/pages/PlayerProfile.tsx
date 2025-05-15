import { useParams } from 'react-router-dom';
import { Typography, Box, Paper } from '@mui/material';
import playersData from '../data/players.json';

const getScoutRankings = (playerId: number) => {
  return playersData.scoutRankings.find((r: any) => r.playerId === playerId) || {};
};

const getMeasurements = (playerId: number) => {
  return playersData.measurements.find((m: any) => m.playerId === playerId) || {};
};

const PlayerProfile = () => {
  const { id } = useParams();
  const player = playersData.bio.find((p: any) => p.playerId === Number(id));
  const scoutRankings = getScoutRankings(Number(id));
  const measurements = getMeasurements(Number(id));

  if (!player) {
    return (
      <Box>
        <Typography variant="h4">Player not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {player.name}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1">Team: {player.currentTeam}</Typography>
        <Typography variant="body1">League: {player.league}</Typography>
        <Typography variant="body1">Birth Date: {player.birthDate}</Typography>
        <Typography variant="body1">Height: {player.height} in</Typography>
        <Typography variant="body1">Weight: {player.weight} lbs</Typography>
        <Typography variant="body1">High School: {player.highSchool}</Typography>
        <Typography variant="body1">Hometown: {player.homeTown}, {player.homeState} {player.homeCountry}</Typography>
        {player.photoUrl && (
          <Box sx={{ mt: 2 }}>
            <img src={player.photoUrl} alt={player.name} style={{ maxWidth: 200 }} />
          </Box>
        )}
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Scout Rankings</Typography>
        {Object.entries(scoutRankings).filter(([k]) => k !== 'playerId').length > 0 ? (
          Object.entries(scoutRankings).filter(([k]) => k !== 'playerId').map(([scout, ranking]) => (
            <Typography key={scout} variant="body1">
              {scout}: {ranking ?? '-'}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">No scout rankings available.</Typography>
        )}
      </Paper>
      {Object.keys(measurements).filter(k => k !== 'playerId').length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Measurements</Typography>
          {Object.entries(measurements).filter(([k]) => k !== 'playerId').length > 0 ? (
            Object.entries(measurements).filter(([k]) => k !== 'playerId').map(([key, value]) => (
              <Typography key={key} variant="body1">
                {key}: {value ?? '-'}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No measurements available.</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PlayerProfile; 