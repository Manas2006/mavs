import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import playersData from '../data/players.json';

const getScoutRankings = (playerId: number) => {
  return playersData.scoutRankings.find((r: any) => r.playerId === playerId) || {};
};

const getAverageRanking = (rankings: any) => {
  const values = Object.values(rankings).filter(v => typeof v === 'number');
  if (values.length === 0) return '-';
  return (values.reduce((sum, rank) => sum + (rank as number), 0) / values.length).toFixed(1);
};

const BigBoard = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const enriched = playersData.bio.map((player: any) => {
      const scoutRankings = getScoutRankings(player.playerId);
      return { ...player, scoutRankings };
    });
    // Sort by average ranking
    const sorted = [...enriched].sort((a, b) => {
      const avgA = parseFloat(getAverageRanking(a.scoutRankings));
      const avgB = parseFloat(getAverageRanking(b.scoutRankings));
      return avgA - avgB;
    });
    setPlayers(sorted);
  }, []);

  // Get all unique scout names for columns
  const scoutNames = Object.keys(players[0]?.scoutRankings || {}).filter(k => k !== 'playerId');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Big Board
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Avg. Rank</TableCell>
              {scoutNames.map((scout) => (
                <TableCell key={scout}>{scout}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <TableRow
                key={player.playerId}
                hover
                onClick={() => navigate(`/player/${player.playerId}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.currentTeam}</TableCell>
                <TableCell>{getAverageRanking(player.scoutRankings)}</TableCell>
                {scoutNames.map((scout) => (
                  <TableCell key={scout}>{player.scoutRankings[scout] ?? '-'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BigBoard; 