import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid,
  Stack,
  Card,
  CardContent,
  useTheme,
  Chip,
  Tooltip as MuiTooltip,
} from '@mui/material';

const formatHeight = (inches: number) => {
  if (!inches) return '-';
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

const formatAge = (birthDate: string) => {
  if (!birthDate) return '-';
  const dob = new Date(birthDate);
  const today = new Date();
  const ageInMilliseconds = today.getTime() - dob.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return ageInYears.toFixed(1);
};

const StatChip = ({ label, value, thresholds, avg }: { label: string; value: number; thresholds: { high: number; low: number }, avg: number }) => {
  const theme = useTheme();
  let color: 'success' | 'error' | 'default' = 'default';
  if (value >= thresholds.high) color = 'success';
  if (value <= thresholds.low) color = 'error';

  const diff = value - avg;
  const showTooltip = color === 'success' || color === 'error';
  const tooltipText = diff > 0
    ? `+${diff.toFixed(2)} above avg`
    : `${diff.toFixed(2)} below avg`;

  const chip = (
    <Chip
      label={`${label}: ${value.toFixed(1)}`}
      color={color}
      size="small"
      sx={{
        fontWeight: 600,
        color: color === 'default' ? theme.palette.text.primary : '#fff',
        minWidth: 80,
      }}
    />
  );

  return showTooltip ? (
    <MuiTooltip title={tooltipText} arrow>{chip}</MuiTooltip>
  ) : chip;
};

const BigBoard = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState('');
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetch('/players.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load players.json');
        return res.json();
      })
      .then(data => {
        const enriched = data.bio.map((player: any) => {
          const seasonStats = data.seasonLogs.find((log: any) => log.playerId === player.playerId) || {};
          return { 
            ...player, 
            seasonStats,
            currentTeam: player.currentTeam ? player.currentTeam.replace(/^\|/, '').trim() : null
          };
        });
        setPlayers(enriched);
        const teams = Array.from(new Set(enriched.map((p: any) => p.currentTeam).filter(Boolean))) as string[];
        setAllTeams(teams);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesName = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = team ? player.currentTeam === team : true;
    return matchesName && matchesTeam;
  });

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, textAlign: 'left', color: '#fff' }}>
        Mavericks Big Board
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search by name"
              variant="outlined"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
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
          </Grid>
        </Grid>
      </Paper>

      {/* Players List */}
      <Stack spacing={2}>
        {filteredPlayers.map((player, index) => (
          <Card
            key={player.playerId}
            elevation={2}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate(`/player/${player.playerId}`)}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {/* Left Section: Rank, Avatar, Name, Position */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        minWidth: 40,
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Avatar
                      src={player.photoUrl || undefined}
                      alt={player.name}
                      sx={{ width: 48, height: 48, bgcolor: 'grey.300', fontWeight: 700, fontSize: 24 }}
                    >
                      {!player.photoUrl && player.name ? player.name[0] : null}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {player.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.position && player.currentTeam 
                          ? `${player.position} | ${player.currentTeam}`
                          : player.position || player.currentTeam || '—'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Middle Section: Measurements */}
                <Grid item xs={12} md={3}>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2">
                      <strong>Height:</strong> {player.height ? formatHeight(player.height) : '-'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Weight:</strong> {player.weight ? `${player.weight} lbs` : '-'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Age:</strong> {player.birthDate ? `${formatAge(player.birthDate)} yrs` : '-'}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Right Section: Stats */}
                <Grid item xs={12} md={5}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(() => {
                      const stats = ['PTS', 'TRB', 'AST', 'BLK', 'STL'];
                      const statThresholds: Record<string, { high: number; low: number }> = {
                        PTS: { high: 15, low: 8 },
                        TRB: { high: 7, low: 3 },
                        AST: { high: 3.5, low: 1.5 },
                        BLK: { high: 1.2, low: 0.3 },
                        STL: { high: 1.2, low: 0.3 },
                      };
                      const avgs: Record<string, number> = {};
                      stats.forEach(stat => {
                        const values = players.map(p => p.seasonStats?.[stat] || 0);
                        avgs[stat] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                      });
                      return stats.map(stat => (
                        <StatChip
                          key={stat}
                          label={stat}
                          value={player.seasonStats?.[stat] || 0}
                          thresholds={statThresholds[stat]}
                          avg={avgs[stat]}
                        />
                      ));
                    })()}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default BigBoard; 