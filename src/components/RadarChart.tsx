import { Box, Paper, Typography, useTheme, Grid } from '@mui/material';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import type { Player } from '../types/player';

interface RadarChartProps {
  players: Player[];
  colors: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({ players, colors }) => {
  const theme = useTheme();

  const attributes = [
    { key: 'scoring', label: 'Scoring', stats: ['PTS', 'FG%', '3P%'] },
    { key: 'defense', label: 'Defense', stats: ['BLK', 'STL', 'DRB'] },
    { key: 'playmaking', label: 'Playmaking', stats: ['AST', 'TOV'] },
    { key: 'efficiency', label: 'Efficiency', stats: ['TS%', 'eFG%'] },
    { key: 'rebounding', label: 'Rebounding', stats: ['TRB', 'ORB'] }
  ];

  const normalizeValue = (value: number, max: number) => {
    return Math.min(Math.max(value / max, 0), 1);
  };

  const calculateAttributeScore = (player: Player, stats: string[]) => {
    if (!player.seasonStats) return 0;
    
    const values = stats.map(stat => {
      const value = player.seasonStats?.[stat] || 0;
      // Define max values for each stat type
      const maxValues: Record<string, number> = {
        PTS: 30,
        FG: 0.7,
        '3P': 0.5,
        BLK: 5,
        STL: 3,
        DRB: 15,
        AST: 10,
        TOV: 5,
        TS: 0.7,
        eFG: 0.7,
        TRB: 15,
        ORB: 8
      };
      return normalizeValue(value, maxValues[stat] || 1);
    });
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const generateRadarData = (player: Player) => {
    return attributes.map(attr => ({
      name: attr.label,
      value: calculateAttributeScore(player, attr.stats)
    }));
  };

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
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 200,
            height: 200,
            backgroundImage: 'url(/mavs-logo.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            opacity: 0.05,
            zIndex: 0
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, position: 'relative', zIndex: 1 }}>
          Player Attributes Comparison
        </Typography>
        <Grid container spacing={3}>
          {players.map((player, index) => (
            <Grid item xs={12} sm={6} md={3} key={player.playerId}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: '100%',
                  border: `2px solid ${colors[index]}`,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 4px 20px ${colors[index]}40`
                  }
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: colors[index],
                    textAlign: 'center'
                  }}
                >
                  {player.name}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsRadarChart
                      data={generateRadarData(player)}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <PolarGrid stroke={theme.palette.divider} />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: theme.palette.text.primary }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 1]}
                        tick={{ fill: theme.palette.text.primary }}
                      />
                      <Radar
                        name={player.name}
                        dataKey="value"
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.3}
                        animationDuration={1000}
                      />
                    </RechartsRadarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default RadarChart; 