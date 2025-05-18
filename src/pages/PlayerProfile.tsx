import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Container, List, ListItem, ListItemText, useTheme, Divider, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Tooltip as MuiTooltip } from '@mui/material';
import type { Theme } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import styled from '@emotion/styled';
import { calculatePlayerAttributes } from '../utils/calculatePlayerAttributes';

// Styled components
const GlowingImage = styled(motion.img)<{ theme: Theme }>`
  width: 200px;
  height: 260px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 0 20px ${props => props.theme.palette.primary.main}40;
  filter: drop-shadow(0 0 8px ${props => props.theme.palette.primary.main}40);
`;

// New styled components for Game Logs
const GameLogsContainer = styled(Paper)<{ theme: Theme }>`
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: ${props => props.theme.palette.background.paper};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 33%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background-image: url('/logo.svg');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.04;
    pointer-events: none;
  }
`;

const StatToggleGroup = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const SummaryTable = styled(TableContainer)<{ theme: Theme }>`
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.palette.background.paper};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Type definitions
interface GameLog {
  date: string;
  pts: number;
  reb: number;
  ast: number;
  timePlayed: string;
  oreb?: number;
  dreb?: number;
}

// Helper function to round to 3 decimal places
const roundToThree = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

// Helper function to convert time string to minutes
const convertTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes + (seconds / 60);
};

// Chart data processing functions
const processSeasonData = (seasonLogs: any[]) => {
  if (!seasonLogs.length) return { type: 'none', data: [] };

  // Check if all logs are from the same season
  const uniqueSeasons = new Set(seasonLogs.map(log => log.Season));
  
  if (uniqueSeasons.size === 1) {
    // Single season - use bar chart
    const season = seasonLogs[0];
    return {
      type: 'bar',
      data: [
        { name: 'Points', value: roundToThree(season.PTS || 0), color: 'primary' },
        { name: 'Rebounds', value: roundToThree(season.TRB || 0), color: 'success' },
        { name: 'Assists', value: roundToThree(season.AST || 0), color: 'info' },
        { name: 'Blocks', value: roundToThree(season.BLK || 0), color: 'warning' },
        { name: 'Minutes', value: roundToThree(season.MP || 0), color: 'secondary' }
      ]
    };
  } else {
    // Multiple seasons - use line chart
    const processedData = seasonLogs
      .map(log => ({
        season: log.Season,
        league: log.League,
        pts: roundToThree(log.PTS || 0),
        trb: roundToThree(log.TRB || 0),
        ast: roundToThree(log.AST || 0),
        blk: roundToThree(log.BLK || 0),
        mp: roundToThree(log.MP || 0),
      }))
      .sort((a, b) => a.season - b.season);

    // Group by season if multiple leagues in same season
    const groupedData = processedData.reduce((acc, curr) => {
      const existing = acc.find(item => item.season === curr.season);
      if (existing) {
        existing.pts = roundToThree((existing.pts + curr.pts) / 2);
        existing.trb = roundToThree((existing.trb + curr.trb) / 2);
        existing.ast = roundToThree((existing.ast + curr.ast) / 2);
        existing.blk = roundToThree((existing.blk + curr.blk) / 2);
        existing.mp = roundToThree((existing.mp + curr.mp) / 2);
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as any[]);

    return {
      type: 'line',
      data: groupedData
    };
  }
};

// Process game logs for visualization
const processGameLogs = (gameReports: GameLog[]) => {
  console.log('Raw game reports:', gameReports);
  if (!gameReports.length) return [];
  
  const processed = gameReports
    .sort((a: GameLog, b: GameLog) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((game: GameLog) => ({
      date: new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pts: Number(game.pts) || 0,
      reb: Number(game.oreb && game.dreb ? game.oreb + game.dreb : game.reb) || 0,
      ast: Number(game.ast) || 0,
      min: convertTimeToMinutes(game.timePlayed)
    }));
  console.log('Processed game logs:', processed);
  return processed;
};

// Helper function to calculate season averages
const calculateSeasonAverages = (gameLogs: any[]) => {
  if (!gameLogs.length) return null;

  const totals = gameLogs.reduce((acc, game) => ({
    pts: acc.pts + (Number(game.pts) || 0),
    reb: acc.reb + (Number(game.oreb && game.dreb ? game.oreb + game.dreb : game.reb) || 0),
    ast: acc.ast + (Number(game.ast) || 0),
    min: acc.min + convertTimeToMinutes(game.timePlayed),
    games: acc.games + 1
  }), { pts: 0, reb: 0, ast: 0, min: 0, games: 0 });

  return {
    ppg: roundToThree(totals.pts / totals.games),
    rpg: roundToThree(totals.reb / totals.games),
    apg: roundToThree(totals.ast / totals.games),
    mpg: roundToThree(totals.min / totals.games)
  };
};

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [scoutRankings, setScoutRankings] = useState<any>({});
  const [measurements, setMeasurements] = useState<any>({});
  const [gameReports, setGameReports] = useState<any[]>([]);
  const [seasonLogs, setSeasonLogs] = useState<any[]>([]);
  const [seasonTotals, setSeasonTotals] = useState<any | null>(null);
  const [scoutReports, setScoutReports] = useState<any[]>([]);
  const [newReport, setNewReport] = useState({ notes: '', rating: 5 });
  const [visibleStats, setVisibleStats] = useState({
    pts: true,
    reb: true,
    ast: true,
    min: true
  });
  const theme = useTheme();

  // Add debug logging for game reports
  useEffect(() => {
    console.log('Game reports updated:', gameReports);
    const processed = processGameLogs(gameReports);
    console.log('Processed game logs:', processed);
  }, [gameReports]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch('/players.json');
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        
        const playerBio = data.bio.find((p: any) => String(p.playerId) === String(id));
        const playerSeasonLogs = data.seasonLogs
          .filter((log: any) => String(log.playerId) === String(id));
        const measurements = data.measurements
          .find((m: any) => String(m.playerId) === String(id)) || {};
        const scoutRankings = data.scoutRankings
          .find((r: any) => String(r.playerId) === String(id)) || {};

        if (playerBio) {
          setPlayer({
            ...playerBio,
            seasonStats: playerSeasonLogs.map((log: any) => ({
              PTS: log.PTS || 0,
              TRB: log.TRB || 0,
              AST: log.AST || 0,
              BLK: log.BLK || 0,
              STL: log.STL || 0,
              MP: log.MP || 0,
              'eFG%': log['eFG%'] || 0
            })),
            measurements: {
              height: measurements.height,
              weight: measurements.weight,
              wingspan: measurements.wingspan,
              standingReach: measurements.standingReach,
              verticalLeap: measurements.verticalLeap,
              benchPress: measurements.benchPress
            },
            scoutRankings: {
              'ESPN Rank': scoutRankings['ESPN Rank'],
              'Sam Vecenie Rank': scoutRankings['Sam Vecenie Rank'],
              'Kevin O\'Connor Rank': scoutRankings['Kevin O\'Connor Rank'],
              'Kyle Boone Rank': scoutRankings['Kyle Boone Rank'],
              'Gary Parrish Rank': scoutRankings['Gary Parrish Rank']
            }
          });
          setScoutRankings(scoutRankings);
          setMeasurements(measurements);
          setSeasonLogs(playerSeasonLogs);
          setGameReports(
            (data.game_logs || [])
              .filter((g: any) => g.playerId === Number(id))
              .map((log: any) => ({
                date: log.date,
                pts: Number(log.pts) || 0,
                reb: Number(log.reb) || 0,
                ast: Number(log.ast) || 0,
                timePlayed: log.timePlayed,
                oreb: Number(log.oreb) || 0,
                dreb: Number(log.dreb) || 0
              }))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  // Process chart data
  const chartData = processSeasonData(seasonLogs);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.notes.trim()) return;
    
    const report = {
      ...newReport,
      playerId: Number(id),
      reportId: Date.now().toString(),
      scout: 'Current Scout'
    };
    
    setScoutReports([report, ...scoutReports]);
    setNewReport({ notes: '', rating: 5 });
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!player) return <Box><Typography variant="h4">Player not found</Typography></Box>;

  const getAge = (birthDate: string) => {
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' ? 8 : 3,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
          <img src="/logo.svg" alt="Mavs Logo" height={90} style={{ opacity: 0.9 }} />
        </Box>
        
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: theme.palette.primary.main }}>
          {player.name}
        </Typography>

        {/* Top Section: 3-column layout */}
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
          {/* Left: Player Image */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper elevation={3} sx={{
              p: 3,
              borderRadius: 2,
              minHeight: 360,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
            }}>
              <GlowingImage
                src={player.photoUrl}
                alt={player.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                theme={theme}
              />
            </Paper>
          </Grid>

          {/* Middle: Player Info */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper elevation={3} sx={{
              p: 3,
              borderRadius: 2,
              minHeight: 360,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
            }}>
              <List dense sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemText primary={<b>Team</b>} secondary={player.currentTeam ? player.currentTeam.replace(/^\|/, '').trim() : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Age</b>} secondary={player.birthDate ? getAge(player.birthDate) : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Hometown</b>} secondary={player.homeTown || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Height</b>} secondary={player.height ? `${Math.floor(player.height / 12)}'${player.height % 12}"` : 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<b>Weight</b>} secondary={player.weight ? `${player.weight} lbs` : 'N/A'} />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right: Radar Chart */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper elevation={3} sx={{
              p: 3,
              borderRadius: 2,
              minHeight: 360,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
            }}>
              {player && player.seasonStats && player.seasonStats.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, textAlign: 'center' }}>Player Attributes</Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 340,
                      minHeight: 240,
                      maxWidth: 700,
                      mx: 'auto',
                      mb: 1,
                      overflow: 'visible',
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={calculatePlayerAttributes(player)}
                        outerRadius={90}
                        margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
                      >
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 9, fill: theme.palette.text.primary, fontWeight: 600 }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Attributes"
                          dataKey="value"
                          stroke={theme.palette.primary.main}
                          fill={theme.palette.primary.main}
                          fillOpacity={0.3}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8
                          }}
                          formatter={(value: number, name: string) => [
                            `${value.toFixed(1)}%`,
                            name
                          ]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                    Normalized attributes based on season performance
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Game Logs" />
          <Tab label="Scouting Reports" />
        </Tabs>

        <Box sx={{ minHeight: 200 }}>
          {tab === 0 && (
            <motion.div {...fadeIn}>
              <Grid container spacing={4}>
                {/* Left: Scout Rankings and Measurements */}
                <Grid item xs={12} md={6}>
                  {/* Scout Rankings */}
                  <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>Scout Rankings</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {(() => {
                        const entries = Object.entries(scoutRankings)
                          .filter(([k, v]) => k !== 'playerId' && v !== undefined && v !== null && v !== '');
                        const values = entries.filter(([_, v]) => typeof v === 'number').map(([_, v]) => v as number);
                        const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
                        
                        const filteredRankings = entries.map(([scout, rank]) => {
                          if (typeof rank !== 'number') return null;
                          const diff = avg !== null ? rank - avg : 0;
                          let color: 'success' | 'error' | 'default' = 'default';
                          if (values.length >= 3) {
                            if (diff <= -3) color = 'success'; // green for below avg
                            if (diff >= 3) color = 'error';   // red for above avg
                          }
                          const showTooltip = color === 'success' || color === 'error';
                          const tooltipText = diff > 0
                            ? `+${diff.toFixed(2)} above avg`
                            : `${diff.toFixed(2)} below avg`;
                          const badge = (
                            <Box
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
                              }}
                            >
                              {String(rank)}
                            </Box>
                          );
                          return (
                            <Box key={scout} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{scout}:</Typography>
                              {showTooltip ? (
                                <MuiTooltip title={tooltipText} arrow>{badge}</MuiTooltip>
                              ) : badge}
                            </Box>
                          );
                        }).filter(Boolean);
                        if (values.length < 3 && filteredRankings.length > 0) {
                          filteredRankings.push(
                            <Typography key="variance-message" variant="body2" color="text.secondary" sx={{ width: '100%', mt: 1 }}>
                              Not enough scout rankings to show variance.
                            </Typography>
                          );
                        }
                        return filteredRankings;
                      })()}
                    </Box>
                  </Paper>

                  {/* Measurements */}
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>Measurements</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(measurements)
                        .filter(([key, value]) => key !== 'playerId' && value !== undefined && value !== null && value !== '')
                        .map(([key, value]) => (
                          <Grid item xs={6} key={key}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
                            </Typography>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                              {(() => {
                                if (key === 'height') {
                                  const inches = Number(value);
                                  if (!isNaN(inches) && inches > 0) {
                                    const feet = Math.floor(inches / 12);
                                    const inch = inches % 12;
                                    const cm = Math.round(inches * 2.54);
                                    return `${feet}'${inch}" (${cm} cm)`;
                                  }
                                  return String(value);
                                }
                                return String(value);
                              })()}
                            </Typography>
                          </Grid>
                        ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Right: Season Performance Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>
                      {chartData.type === 'line' ? 'Season Performance' : 'Season Averages'}
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {chartData.type === 'line' ? (
                          <LineChart data={chartData.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="season" 
                              tick={{ fontSize: 12 }}
                              label={{ value: 'Season', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip 
                              formatter={(value) =>
                                typeof value === 'number' ? value.toFixed(3) : value
                              }
                              contentStyle={{ 
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8
                              }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="pts" stroke={theme.palette.primary.main} name="Points" />
                            <Line type="monotone" dataKey="trb" stroke={theme.palette.success.main} name="Rebounds" />
                            <Line type="monotone" dataKey="ast" stroke={theme.palette.info.main} name="Assists" />
                            <Line type="monotone" dataKey="blk" stroke={theme.palette.warning.main} name="Blocks" />
                            <Line type="monotone" dataKey="mp" stroke={theme.palette.secondary.main} name="Minutes" />
                          </LineChart>
                        ) : chartData.type === 'bar' ? (
                          <BarChart data={chartData.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip 
                              formatter={(value) =>
                                typeof value === 'number' ? value.toFixed(3) : value
                              }
                              contentStyle={{ 
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill={theme.palette.primary.main}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography color="text.secondary">No season data available</Typography>
                          </Box>
                        )}
                      </ResponsiveContainer>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                      {chartData.type === 'line' 
                        ? 'Performance trends across seasons' 
                        : chartData.type === 'bar' 
                          ? 'Single season averages' 
                          : ''}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {tab === 1 && (
            <GameLogsContainer theme={theme}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 3 }}>
                Game-by-Game Performance
              </Typography>

              {/* Stat Toggles */}
              <StatToggleGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleStats.pts}
                      onChange={(e) => setVisibleStats(prev => ({ ...prev, pts: e.target.checked }))}
                      sx={{ color: '#0053BC' }}
                    />
                  }
                  label="Points"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleStats.reb}
                      onChange={(e) => setVisibleStats(prev => ({ ...prev, reb: e.target.checked }))}
                      sx={{ color: theme.palette.success.main }}
                    />
                  }
                  label="Rebounds"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleStats.ast}
                      onChange={(e) => setVisibleStats(prev => ({ ...prev, ast: e.target.checked }))}
                      sx={{ color: theme.palette.info.main }}
                    />
                  }
                  label="Assists"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleStats.min}
                      onChange={(e) => setVisibleStats(prev => ({ ...prev, min: e.target.checked }))}
                      sx={{ color: theme.palette.secondary.main }}
                    />
                  }
                  label="Minutes"
                />
              </StatToggleGroup>

              {/* Game Performance Chart */}
              <Box sx={{ height: 400, mb: 4, position: 'relative' }}>
                {processGameLogs(gameReports).length <= 1 && (
                  <Typography sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', color: theme.palette.text.secondary, zIndex: 2 }}>
                    {processGameLogs(gameReports).length === 0 ? 'No game logs available for this player.' : 'Only one game log available for this player.'}
                  </Typography>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart key={JSON.stringify(processGameLogs(gameReports))} data={processGameLogs(gameReports)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#0053BC' }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#0053BC' }}
                    />
                    <Tooltip 
                      formatter={(value) =>
                        typeof value === 'number' ? value.toFixed(3) : value
                      }
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8
                      }}
                    />
                    <Legend />
                    {visibleStats.pts && (
                      <Line 
                        type="monotone" 
                        dataKey="pts" 
                        stroke="#0053BC" 
                        name="Points"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {visibleStats.reb && (
                      <Line 
                        type="monotone" 
                        dataKey="reb" 
                        stroke={theme.palette.success.main} 
                        name="Rebounds"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {visibleStats.ast && (
                      <Line 
                        type="monotone" 
                        dataKey="ast" 
                        stroke={theme.palette.info.main} 
                        name="Assists"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                    {visibleStats.min && (
                      <Line 
                        type="monotone" 
                        dataKey="min" 
                        stroke={theme.palette.secondary.main} 
                        name="Minutes"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Season Summary Stats */}
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>
                Season Averages
              </Typography>
              <SummaryTable theme={theme}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Stat</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Average</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const averages = calculateSeasonAverages(gameReports);
                      if (!averages) return (
                        <TableRow>
                          <TableCell colSpan={3} align="center">No game data available</TableCell>
                        </TableRow>
                      );

                      return [
                        {
                          stat: 'PPG',
                          value: typeof averages.ppg === 'number' ? averages.ppg.toFixed(3) : '—',
                          desc: 'Points per game'
                        },
                        {
                          stat: 'RPG',
                          value: typeof averages.rpg === 'number' ? averages.rpg.toFixed(3) : '—',
                          desc: 'Rebounds per game'
                        },
                        {
                          stat: 'APG',
                          value: typeof averages.apg === 'number' ? averages.apg.toFixed(3) : '—',
                          desc: 'Assists per game'
                        },
                        {
                          stat: 'MPG',
                          value: typeof averages.mpg === 'number' ? averages.mpg.toFixed(3) : '—',
                          desc: 'Minutes per game'
                        }
                      ].map((row) => (
                        <TableRow 
                          key={row.stat}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: theme.palette.action.hover 
                            }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>{row.stat}</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0053BC' }}>
                            {row.value}
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.text.secondary }}>
                            {row.desc}
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </SummaryTable>
            </GameLogsContainer>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700, mb: 2 }}>Scouting Reports</Typography>
              
              {/* New Report Form */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box component="form" onSubmit={handleSubmitReport} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="h6" gutterBottom>Submit a Scouting Report</Typography>
                  <TextField
                    label="Notes"
                    multiline
                    minRows={2}
                    value={newReport.notes}
                    onChange={e => setNewReport(prev => ({ ...prev, notes: e.target.value }))}
                    required
                    fullWidth
                  />
                  <FormControl sx={{ width: 120 }}>
                    <InputLabel id="rating-label">Rating</InputLabel>
                    <Select
                      labelId="rating-label"
                      value={newReport.rating}
                      label="Rating"
                      onChange={e => setNewReport(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" color="primary">
                    Submit Report
                  </Button>
                </Box>
              </Paper>

              {/* Existing Reports */}
              {scoutReports.length === 0 ? (
                <Typography variant="body2">No scouting reports available.</Typography>
              ) : (
                scoutReports.map((report, idx) => (
                  <Paper key={idx} sx={{ mb: 2, p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
                    {report.scout && (
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>{report.scout}</Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">Rating: {report.rating}/10</Typography>
                    <Typography variant="body1">{report.notes}</Typography>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PlayerProfile; 