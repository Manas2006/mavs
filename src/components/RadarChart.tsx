import { Box, Paper, Typography, useTheme, Grid } from '@mui/material';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import type { Player } from '../types/player';
import { calculatePlayerAttributes } from '../utils/calculatePlayerAttributes';

interface RadarChartProps {
  players: Player[];
  colors: string[];
}

const RadarChart: React.FC<RadarChartProps> = ({ players, colors }) => {
  const theme = useTheme();

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
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: `0 4px 12px ${colors[index]}20`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${colors[index]}40`
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
                      data={calculatePlayerAttributes(player)}
                      outerRadius={90}
                      margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
                    >
                      <PolarGrid stroke={theme.palette.divider} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ 
                          fontSize: 9,
                          fill: theme.palette.text.primary,
                          fontWeight: 600
                        }}
                        tickLine={false}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name={player.name}
                        dataKey="value"
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.3}
                        animationDuration={1000}
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