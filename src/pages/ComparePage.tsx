import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import type { Player } from '../types/player';
import PlayerSelector from '../components/PlayerSelector';
import PlayerInfoCard from '../components/PlayerInfoCard';
import SeasonStatsChart from '../components/SeasonStatsChart';
import MeasurementsChart from '../components/MeasurementsChart';
import ScoutRankingsTable from '../components/ScoutRankingsTable';
import RadarChart from '../components/RadarChart';
import PerformancePodium from '../components/PerformancePodium';

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

          // Calculate season averages
          const seasonStats = playerSeasonLogs.length > 0 ? {
            PTS: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.PTS) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            TRB: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.TRB) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            AST: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.AST) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            BLK: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.BLK) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            STL: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.STL) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            MP: Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log.MP) || 0), 0) / playerSeasonLogs.length).toFixed(1)),
            'eFG%': Number((playerSeasonLogs.reduce((sum: number, log: any) => sum + (Number(log['eFG%']) || 0), 0) / playerSeasonLogs.length).toFixed(1))
          } : {
            PTS: 0,
            TRB: 0,
            AST: 0,
            BLK: 0,
            STL: 0,
            MP: 0,
            'eFG%': 0
          };

          return {
            playerId: player.playerId,
            name: player.name,
            currentTeam: player.currentTeam,
            position: player.position,
            height: player.height,
            weight: player.weight,
            photoUrl: player.photoUrl,
            headshot: player.headshot,
            seasonStats,
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

            {/* Performance Podium */}
            <PerformancePodium
              players={selectedPlayers}
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