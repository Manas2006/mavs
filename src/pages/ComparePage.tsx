import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import type { Player } from '../types/player';
import PlayerSelector from '../components/PlayerSelector';
import PlayerInfoCard from '../components/PlayerInfoCard';
import SeasonStatsChart from '../components/SeasonStatsChart';
import MeasurementsChart from '../components/MeasurementsChart';
import ScoutRankingsTable from '../components/ScoutRankingsTable';
import RadarChart from '../components/RadarChart';

const ComparePage = () => {
  const theme = useTheme();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = useMemo(() => [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main
  ], [theme]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/players.json');
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        
        // Process the data to combine bio, season logs, measurements, and scout rankings
        const processedPlayers = data.bio.map((player: any) => {
          const playerSeasonLogs = data.seasonLogs
            .filter((log: any) => log.playerId === player.playerId);
          
          const measurements = data.measurements
            .find((m: any) => m.playerId === player.playerId) || {};
          
          const scoutRankings = data.scoutRankings
            .find((r: any) => r.playerId === player.playerId) || {};

          return {
            playerId: player.playerId,
            name: player.name,
            currentTeam: player.currentTeam,
            position: player.position,
            height: player.height,
            weight: player.weight,
            photoUrl: player.photoUrl,
            headshot: player.headshot,
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
          };
        });

        setPlayers(processedPlayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleRandomize = () => {
    const availablePlayers = players.filter(
      p => !selectedPlayers.some(sp => sp.playerId === p.playerId)
    );
    const randomPlayers = [...availablePlayers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4 - selectedPlayers.length);
    setSelectedPlayers([...selectedPlayers, ...randomPlayers]);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Compare Players
          </Typography>
        </Box>

        <PlayerSelector
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayersChange={setSelectedPlayers}
          maxPlayers={4}
        />

        {selectedPlayers.length >= 2 && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Player Info Cards */}
            <Grid container spacing={3}>
              {selectedPlayers.map((player, index) => (
                <Grid item xs={12} sm={6} md={3} key={player.playerId}>
                  <PlayerInfoCard
                    player={player}
                    color={colors[index]}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Season Stats Chart */}
            <SeasonStatsChart
              players={selectedPlayers}
              colors={colors}
            />

            {/* Radar Chart */}
            <RadarChart
              players={selectedPlayers}
              colors={colors}
            />

            {/* Measurements Chart */}
            <MeasurementsChart
              players={selectedPlayers}
              colors={colors}
            />

            {/* Scout Rankings Table */}
            <ScoutRankingsTable
              players={selectedPlayers}
              colors={colors}
            />
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default ComparePage; 