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
    { key: 'height', label: 'Height', unit: 'in', format: (value?: number) => value ? `${Math.floor(value / 12)}'${value % 12}"` : null },
    { key: 'weight', label: 'Weight', unit: 'lbs', format: (value?: number) => value ? `${value} lbs` : null },
    { key: 'wingspan', label: 'Wingspan', unit: 'in', format: (value?: number) => value ? `${value}"` : null },
    { key: 'standingReach', label: 'Standing Reach', unit: 'in', format: (value?: number) => value ? `${value}"` : null },
    { key: 'verticalLeap', label: 'Vertical Leap', unit: 'in', format: (value?: number) => value ? `${value}"` : null },
    { key: 'benchPress', label: 'Bench Press', unit: 'reps', format: (value?: number) => value ? `${value}` : null }
  ];

  const findBestValue = (values: (number | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== undefined);
    if (validValues.length === 0) return -1;
    return values.indexOf(Math.max(...validValues));
  };

  const hasValidData = (measurement: typeof measurements[0]) => {
    return players.some(player => 
      player.measurements?.[measurement.key as keyof typeof player.measurements] !== undefined
    );
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
          Physical Measurements Comparison
        </Typography>
        <TableContainer sx={{ position: 'relative', zIndex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Measurement</TableCell>
                {players.map((player, index) => (
                  <TableCell
                    key={player.playerId}
                    sx={{
                      color: colors[index],
                      fontWeight: 600,
                      borderBottom: `2px solid ${colors[index]}40`
                    }}
                  >
                    {player.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {measurements
                .filter(measurement => hasValidData(measurement))
                .map((measurement) => {
                  const values = players.map(p => p.measurements?.[measurement.key as keyof typeof p.measurements]);
                  const bestIndex = findBestValue(values);
                  
                  return (
                    <TableRow 
                      key={measurement.key}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ 
                          fontWeight: 600,
                          borderRight: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        {measurement.label}
                      </TableCell>
                      {players.map((player, index) => {
                        const value = player.measurements?.[measurement.key as keyof typeof player.measurements];
                        const formattedValue = measurement.format(value);
                        
                        return (
                          <TableCell
                            key={player.playerId}
                            sx={{
                              color: colors[index],
                              fontWeight: 500,
                              backgroundColor: index === bestIndex ? `${colors[index]}15` : 'transparent',
                              transition: 'background-color 0.2s ease-in-out'
                            }}
                          >
                            {formattedValue}
                          </TableCell>
                        );
                      })}
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