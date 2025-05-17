import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Container, List, ListItem, ListItemText, useTheme, Divider, Tabs, Tab, ToggleButtonGroup, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [scoutRankings, setScoutRankings] = useState<any>({});
  const [measurements, setMeasurements] = useState<any>({});
  const [gameLogsView, setGameLogsView] = useState<'perGame' | 'totals'>('perGame');
  const [gameReports, setGameReports] = useState<any[]>([]);
  const [seasonTotals, setSeasonTotals] = useState<any | null>(null);
  const theme = useTheme();
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    fetch('/players.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load players.json');
        return res.json();
      })
      .then(data => {
        const playerObj = data.bio.find((p: any) => p.playerId === Number(id));
        setPlayer(playerObj);
        setScoutRankings(data.scoutRankings.find((r: any) => r.playerId === Number(id)) || {});
        setMeasurements(data.measurements.find((m: any) => m.playerId === Number(id)) || {});
        setGameReports((data.game_logs || []).filter((g: any) => g.playerId === Number(id)));
        setSeasonTotals((data.seasonLogs || []).find((log: any) => log.playerId === Number(id)) || null);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!player) return <Box><Typography variant="h4">Player not found</Typography></Box>;

  // Calculate age
  const getAge = (birthDate: string) => {
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          position: 'relative',
          maxWidth: 800,
          width: '100%',
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' ? 8 : 3,
          bgcolor: 'background.paper',
        }}
      >
        {/* Mavericks logo top-left */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
          <img src="/mavs logo.png" alt="Mavs Logo" height={36} style={{ opacity: 0.9 }} />
        </Box>
        {/* Player Name */}
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, textAlign: 'center', color: theme.palette.primary.main }}>
          {player.name}
        </Typography>
        <Grid container spacing={4} alignItems="flex-start" justifyContent="center" wrap="wrap-reverse">
          {/* Left: Headshot */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box sx={{ width: 200, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 16 }}
                />
              </Paper>
            </Box>
          </Grid>
          {/* Right: Info */}
          <Grid item xs={12} md={8}>
            <Box sx={{ px: { xs: 0, md: 2 }, py: 1 }}>
              <List dense>
                <ListItem>
                  <ListItemText primary={<b>Team</b>} secondary={player.currentTeam || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Age</b>} secondary={player.birthDate ? getAge(player.birthDate) : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Hometown</b>} secondary={player.homeTown || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Height</b>} secondary={player.height ? `${player.height} in` : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Weight</b>} secondary={player.weight ? `${player.weight} lbs` : 'N/A'} />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Game Logs" />
          <Tab label="Scouting Reports" />
        </Tabs>
        <Box sx={{ minHeight: 200 }}>
          {tab === 0 && (
            <Box>
              {/* Scout Rankings Section */}
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>Scout Rankings</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {Object.entries(scoutRankings)
                  .filter(([k]) => k !== 'playerId')
                  .map(([scout, rank]) => {
                    // Calculate average for outlier highlighting
                    const values = Object.entries(scoutRankings)
                      .filter(([k]) => k !== 'playerId' && typeof scoutRankings[k] === 'number')
                      .map(([_, v]) => v as number);
                    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
                    const diff = typeof rank === 'number' && avg !== null ? rank - avg : 0;
                    let color: 'success' | 'error' | 'default' = 'default';
                    if (diff <= -3) color = 'success';
                    if (diff >= 3) color = 'error';
                    return (
                      <Box key={scout} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{scout}:</Typography>
                        <Box
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            bgcolor:
                              color === 'success'
                                ? theme.palette.success.main
                                : color === 'error'
                                ? theme.palette.error.main
                                : theme.palette.action.selected,
                            color: color !== 'default' ? '#fff' : theme.palette.text.primary,
                            fontWeight: 700,
                            fontSize: '1rem',
                            minWidth: 28,
                            textAlign: 'center',
                            cursor: color !== 'default' ? 'pointer' : 'default',
                            transition: 'background 0.2s',
                          }}
                          title={
                            color !== 'default' && typeof diff === 'number'
                              ? `${Math.abs(diff)} spots ${diff < 0 ? 'higher' : 'lower'} than avg`
                              : undefined
                          }
                        >
                          {String(rank !== undefined && rank !== null ? rank : '-')}
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Measurements Section */}
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>Measurements</Typography>
              <Grid container spacing={1}>
                {Object.entries(measurements)
                  .filter(([k]) => k !== 'playerId')
                  .map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>{String(value !== undefined && value !== null ? value : '-')}</Typography>
                    </Grid>
                  ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
              {/* Fit for Mavericks Section */}
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 1 }}>Fit for Mavericks</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ bgcolor: theme.palette.primary.main, color: '#fff', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.95rem' }}>High Potential</Box>
                <Box sx={{ bgcolor: theme.palette.success.main, color: '#fff', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.95rem' }}>Strong Fit</Box>
                <Box sx={{ bgcolor: theme.palette.info.main, color: '#fff', px: 2, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.95rem' }}>Versatile</Box>
              </Box>
            </Box>
          )}
          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ToggleButtonGroup
                  value={gameLogsView}
                  exclusive
                  onChange={(_, v) => v && setGameLogsView(v)}
                  size="small"
                  sx={{ bgcolor: theme.palette.action.hover, borderRadius: 2 }}
                >
                  <ToggleButton value="perGame" sx={{ fontWeight: 600 }}>Per Game</ToggleButton>
                  <ToggleButton value="totals" sx={{ fontWeight: 600 }}>Totals</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflowX: 'auto', borderRadius: 2 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Opponent</TableCell>
                      <TableCell>PTS</TableCell>
                      <TableCell>REB</TableCell>
                      <TableCell>AST</TableCell>
                      <TableCell>MIN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gameLogsView === 'perGame'
                      ? gameReports.map((game, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{game.date ? new Date(game.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</TableCell>
                            <TableCell>{game.opponent || '-'}</TableCell>
                            <TableCell>{game.pts ?? '-'}</TableCell>
                            <TableCell>{game.reb ?? '-'}</TableCell>
                            <TableCell>{game.ast ?? '-'}</TableCell>
                            <TableCell>{game.timePlayed ?? '-'}</TableCell>
                          </TableRow>
                        ))
                      : seasonTotals ? (
                          <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 700 }}>Totals</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{seasonTotals.PTS ?? '-'}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{seasonTotals.REB ?? '-'}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{seasonTotals.AST ?? '-'}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{seasonTotals.MP ?? '-'}</TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">No season totals available.</TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          {tab === 2 && <Box>Scouting Reports content goes here</Box>}
        </Box>
      </Paper>
    </Container>
  );
};

export default PlayerProfile; 