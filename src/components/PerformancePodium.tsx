import { Box, Paper, Typography, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import type { Player } from '../types/player';

interface PerformancePodiumProps {
  players: Player[];
  colors: string[];
}

const leagueMultipliers: Record<string, number> = {
  'NBA': 1.00,
  'EuroLeague': 0.97,
  'Liga ACB': 0.95,
  'ACB': 0.95,
  'BSL': 0.93,
  'VTB United League': 0.92,
  'GBL': 0.91,
  'Serie A': 0.90,
  'LNB Pro A': 0.89,
  'BBL': 0.88,
  'ABA': 0.87,
  'LKL': 0.86,
  'NBL': 0.85,
  'NCAA D-I': 0.80,
  'NCAA D1': 0.80,
  'NCAA D-II': 0.70,
  'NCAA D2': 0.70,
  'NCAA D-III': 0.65,
  'NCAA D3': 0.65,
  'G League': 0.75,
  'CBA': 0.75,
  'High School': 0.60,
  'Other': 0.50
};

function getCompetitionMultiplier(player: Player) {
  // Try league, then leagueType, then fallback
  return (
    leagueMultipliers[player.league?.trim() || ''] ||
    leagueMultipliers[player.leagueType?.trim() || ''] ||
    leagueMultipliers['Other']
  );
}

const calculatePerformanceScore = (stats: Record<string, number> | undefined, player: Player) => {
  if (!stats) return 0;
  const baseScore =
    (stats.PTS || 0) * 1.0 +
    (stats.TRB || 0) * 0.8 +
    (stats.AST || 0) * 0.8 +
    (stats.BLK || 0) * 0.6 +
    (stats.STL || 0) * 0.6 +
    (stats.MP || 0) * 0.4 +
    (stats['eFG%'] || 0) * 0.5;
  const multiplier = getCompetitionMultiplier(player);
  return baseScore * multiplier;
};

const getOlympicOrder = (arr: any[]) => {
  if (arr.length === 2) return [arr[1], arr[0]];
  if (arr.length === 3) return [arr[2], arr[0], arr[1]];
  if (arr.length === 4) return [arr[2], arr[0], arr[1], arr[3]];
  return arr;
};

const PerformancePodium = ({ players, colors }: PerformancePodiumProps) => {
  const theme = useTheme();

  // Calculate scores and sort players
  const playersWithScores = players
    .map(player => ({
      ...player,
      score: calculatePerformanceScore(player.seasonStats, player)
    }))
    .sort((a, b) => b.score - a.score);

  if (playersWithScores.length < 2) return null;

  const podiumOrder = getOlympicOrder(playersWithScores);
  const maxScore = Math.max(...playersWithScores.map(p => p.score), 1);
  const minHeight = 80;
  const maxHeight = 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/mavs-logo.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.03,
            zIndex: 0
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, position: 'relative', zIndex: 1 }}>
          Performance Podium
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 2,
            position: 'relative',
            zIndex: 1,
            minHeight: maxHeight + 40
          }}
        >
          {podiumOrder.map((player, index) => {
            const place = playersWithScores.findIndex(p => p.playerId === player.playerId);
            const podiumColor = place === 0 ? '#FFD700' : place === 1 ? '#C0C0C0' : place === 2 ? '#CD7F32' : theme.palette.grey[700];
            const height = minHeight + ((player.score / maxScore) * (maxHeight - minHeight));
            return (
              <Tooltip
                key={player.playerId}
                title={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {player.name}
                    </Typography>
                    <Typography variant="body2">
                      Score: {player.score.toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      League: {player.league || player.leagueType || 'Unknown'}
                    </Typography>
                    <Typography variant="body2">
                      Competition Multiplier: {getCompetitionMultiplier(player)}
                    </Typography>
                    {player.seasonStats && Object.entries(player.seasonStats)
                      .filter(([_, value]) => (value as number) > 0)
                      .sort(([_k1, a], [_k2, b]) => (b as number) - (a as number))
                      .slice(0, 2)
                      .map(([key, value], i) => (
                        <Typography key={i} variant="body2">
                          {key}: {(value as number).toFixed(1)}
                        </Typography>
                      ))
                    }
                  </Box>
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height,
                      backgroundColor: podiumColor,
                      borderRadius: '4px 4px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.getContrastText(podiumColor),
                        fontWeight: 700,
                        textAlign: 'center',
                        px: 1
                      }}
                    >
                      {player.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 600
                    }}
                  >
                    {player.score.toFixed(1)}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default PerformancePodium; 