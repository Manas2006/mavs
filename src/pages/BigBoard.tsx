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
  Chip,
  Tooltip,
} from '@mui/material';

const getAverageRanking = (rankings: any) => {
  // Only include keys that end with 'Rank' and are numbers
  const values = Object.entries(rankings)
    .filter(([key, value]) => key.endsWith('Rank') && typeof value === 'number')
    .map(([_, value]) => value as number) as number[];
  if (values.length === 0) return '-';
  return (values.reduce((sum, rank) => (sum as number) + (rank as number), 0) / values.length).toFixed(1);
};

const getHighlight = (ranking: number, avg: number) => {
  if (ranking == null) return null;
  const diff = ranking - avg;
  if (diff <= -3) return { color: 'success', diff };
  if (diff >= 3) return { color: 'error', diff };
  return null;
};

const BigBoard = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [scoutNames, setScoutNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/players.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load players.json');
        return res.json();
      })
      .then(data => {
        const getScoutRankings = (playerId: number) =>
          data.scoutRankings.find((r: any) => r.playerId === playerId) || {};
        const enriched = data.bio.map((player: any) => {
          const scoutRankings = getScoutRankings(player.playerId);
          return { ...player, scoutRankings };
        });
        const sorted = [...enriched].sort((a, b) => {
          const avgA = parseFloat(getAverageRanking(a.scoutRankings));
          const avgB = parseFloat(getAverageRanking(b.scoutRankings));
          return avgA - avgB;
        });
        setPlayers(sorted);
        // Get all unique scout names for columns
        const firstWithRankings = sorted.find(p => p.scoutRankings && Object.keys(p.scoutRankings).length > 0);
        setScoutNames(firstWithRankings ? Object.keys(firstWithRankings.scoutRankings).filter(k => k !== 'playerId') : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

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
                {scoutNames.map((scout) => {
                  const ranking = player.scoutRankings[scout];
                  const avg = Number(getAverageRanking(player.scoutRankings));
                  const highlight = getHighlight(ranking, avg);
                  if (ranking == null) {
                    return <TableCell key={scout}>-</TableCell>;
                  }
                  if (highlight) {
                    const absDiff = Math.abs(highlight.diff);
                    const direction = highlight.diff < 0 ? 'higher' : 'lower';
                    return (
                      <TableCell key={scout}>
                        <Tooltip title={`${absDiff} spots ${direction} than avg`} arrow>
                          <Chip
                            label={ranking}
                            color={highlight.color as 'success' | 'error'}
                            size="small"
                            sx={{ color: '#fff', fontWeight: 600 }}
                          />
                        </Tooltip>
                      </TableCell>
                    );
                  }
                  return <TableCell key={scout}>{ranking}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BigBoard; 