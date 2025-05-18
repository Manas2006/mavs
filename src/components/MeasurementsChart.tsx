import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';

interface Player {
  playerId: number;
  name: string;
  measurements?: {
    height?: number;
    weight?: number;
    wingspan?: number;
    standingReach?: number;
    verticalLeap?: number;
    benchPress?: number;
  };
}

interface MeasurementsChartProps {
  players: Player[];
  colors: string[];
}

const MeasurementsChart = ({ players, colors }: MeasurementsChartProps) => {
  const theme = useTheme();

  const measurements = [
    { key: 'height', label: 'Height', unit: 'in', format: (value?: number) => value ? `${Math.floor(value / 12)}'${value % 12}"` : 'N/A' },
    { key: 'weight', label: 'Weight', unit: 'lbs', format: (value?: number) => value ? `${value} lbs` : 'N/A' },
    { key: 'wingspan', label: 'Wingspan', unit: 'in', format: (value?: number) => value ? `${value}"` : 'N/A' },
    { key: 'standingReach', label: 'Standing Reach', unit: 'in', format: (value?: number) => value ? `${value}"` : 'N/A' },
    { key: 'verticalLeap', label: 'Vertical Leap', unit: 'in', format: (value?: number) => value ? `${value}"` : 'N/A' },
    { key: 'benchPress', label: 'Bench Press', unit: 'reps', format: (value?: number) => value ? `${value}` : 'N/A' }
  ];

  const findBestValue = (values: (number | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== undefined);
    if (validValues.length === 0) return -1;
    return values.indexOf(Math.max(...validValues));
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
          Physical Measurements Comparison
        </Typography>
        <TableContainer sx={{ position: 'relative', zIndex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Measurement</TableCell>
                {players.map((player, index) => (
                  <TableCell
                    key={player.playerId}
                    sx={{
                      color: colors[index],
                      fontWeight: 600
                    }}
                  >
                    {player.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements.map((measurement) => {
                const values = players.map(p => p.measurements?.[measurement.key as keyof typeof p.measurements]);
                const bestIndex = findBestValue(values);
                
                return (
                  <TableRow key={measurement.key}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: 600 }}
                    >
                      {measurement.label}
                    </TableCell>
                    {players.map((player, index) => (
                      <TableCell
                        key={player.playerId}
                        sx={{
                          color: colors[index],
                          fontWeight: 500,
                          backgroundColor: index === bestIndex ? `${colors[index]}15` : 'transparent'
                        }}
                      >
                        {measurement.format(player.measurements?.[measurement.key as keyof typeof player.measurements])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
};

export default MeasurementsChart; 