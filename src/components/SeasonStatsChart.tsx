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
    players.forEach((player, index) => {
      entry[`player${index}`] = player.seasonStats?.[stat.key] || 0;
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
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
          {payload.map((entry: any, index: number) => (
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
          Season Stats Comparison
        </Typography>
        <Box sx={{ height: 400, position: 'relative', zIndex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                type="number"
                tick={{ fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fill: theme.palette.text.primary, fontSize: 12 }}
                axisLine={{ stroke: theme.palette.divider }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: 20
                }}
              />
              {players.map((player, index) => (
                <Bar
                  key={player.playerId}
                  dataKey={`player${index}`}
                  name={player.name}
                  fill={colors[index]}
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