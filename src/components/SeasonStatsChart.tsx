import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

interface Player {
  playerId: number;
  name: string;
  seasonStats?: Record<string, number>;
}

interface SeasonStatsChartProps {
  players: Player[];
  colors: string[];
}

const SeasonStatsChart = ({ players, colors }: SeasonStatsChartProps) => {
  const theme = useTheme();

  const stats = [
    { key: 'PTS', label: 'Points Per Game', unit: 'ppg' },
    { key: 'TRB', label: 'Rebounds', unit: 'rpg' },
    { key: 'AST', label: 'Assists', unit: 'apg' },
    { key: 'BLK', label: 'Blocks', unit: 'bpg' },
    { key: 'STL', label: 'Steals', unit: 'spg' },
    { key: 'MP', label: 'Minutes', unit: 'mpg' }
  ];

  const data = stats.map(stat => {
    const entry: any = { name: stat.label };
    players.forEach((player) => {
      entry[`player${player.playerId}`] = player.seasonStats?.[stat.key] || 0;
    });
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const stat = stats.find(s => s.label === label);
      return (
        <Paper
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
          {payload.map((entry: any) => (
            <Box
              key={entry.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: entry.color
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color
                }}
              />
              <Typography variant="body2">
                {entry.name}: {entry.value.toFixed(1)} {stat?.unit}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
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
          Season Stats Comparison
        </Typography>
        <Box sx={{ height: 400, position: 'relative', zIndex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ 
                  fill: theme.palette.text.primary,
                  fontSize: 12
                }}
                axisLine={{ stroke: theme.palette.divider }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ 
                  fill: theme.palette.text.primary, 
                  fontSize: 12,
                  fontWeight: 500
                }}
                axisLine={{ stroke: theme.palette.divider }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: 20,
                  fontSize: 12
                }}
              />
              {players.map((player, index) => (
                <Bar
                  key={player.playerId}
                  dataKey={`player${player.playerId}`}
                  name={player.name}
                  fill={colors[index % colors.length]}
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SeasonStatsChart; 