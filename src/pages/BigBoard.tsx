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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
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
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState('');
  const [allTeams, setAllTeams] = useState<string[]>([]);
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
        // Get all unique teams for filter
        const teams = Array.from(new Set(sorted.map((p: any) => p.currentTeam).filter(Boolean)));
        setAllTeams(teams);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter players by search and team
  const filteredPlayers = players.filter(player => {
    const matchesName = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = team ? player.currentTeam === team : true;
    return matchesName && matchesTeam;
  });

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, textAlign: 'left' }}>
        Mavericks Big Board
      </Typography>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            label="Search by name"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="team-filter-label">Team</InputLabel>
            <Select
              labelId="team-filter-label"
              value={team}
              label="Team"
              onChange={e => setTeam(e.target.value)}
            >
              <MenuItem value="">All Teams</MenuItem>
              {allTeams.map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <TableContainer component={Paper} sx={{ overflowX: 'auto', p: { xs: 1, sm: 2 } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Avg. Rank</TableCell>
              {scoutNames.map((scout) => (
                <TableCell key={scout}>{scout}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player, index) => (
              <TableRow
                key={player.playerId}
                hover
                onClick={() => navigate(`/player/${player.playerId}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={player.photoUrl || undefined}
                      alt={player.name}
                      sx={{ width: 36, height: 36, bgcolor: 'grey.300', color: 'text.primary', fontWeight: 600 }}
                    >
                      {!player.photoUrl && player.name ? player.name[0] : ''}
                    </Avatar>
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      {player.name}
                    </Typography>
                  </Box>
                </TableCell>
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