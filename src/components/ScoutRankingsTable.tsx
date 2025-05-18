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
  scoutRankings?: {
    'ESPN Rank'?: number;
    'Sam Vecenie Rank'?: number;
    'Kevin O\'Connor Rank'?: number;
    'Kyle Boone Rank'?: number;
    'Gary Parrish Rank'?: number;
  };
}

interface ScoutRankingsTableProps {
  players: Player[];
  colors: string[];
}

const ScoutRankingsTable = ({ players, colors }: ScoutRankingsTableProps) => {
  const theme = useTheme();

  const scouts = [
    { key: 'ESPN Rank', label: 'ESPN' },
    { key: 'Sam Vecenie Rank', label: 'Sam Vecenie' },
    { key: 'Kevin O\'Connor Rank', label: 'Kevin O\'Connor' },
    { key: 'Kyle Boone Rank', label: 'Kyle Boone' },
    { key: 'Gary Parrish Rank', label: 'Gary Parrish' }
  ];

  const calculateAverageRank = (player: Player) => {
    const rankings = Object.values(player.scoutRankings || {})
      .filter((rank): rank is number => rank !== undefined && rank !== null);
    if (rankings.length === 0) return null;
    return (rankings.reduce((sum, rank) => sum + rank, 0) / rankings.length).toFixed(1);
  };

  const findBestRank = (values: (number | undefined | null)[]) => {
    const validValues = values.filter((v): v is number => v !== undefined && v !== null);
    if (validValues.length === 0) return -1;
    return values.indexOf(Math.min(...validValues));
  };

  const hasRankingData = (player: Player) => {
    return Object.values(player.scoutRankings || {}).some(rank => rank !== undefined && rank !== null);
  };

  const playersWithRankings = players.filter(hasRankingData);

  if (playersWithRankings.length === 0) {
    return null;
  }

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
          Scout Rankings Comparison
        </Typography>
        <TableContainer sx={{ position: 'relative', zIndex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Scout</TableCell>
                {playersWithRankings.map((player, index) => (
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
              {scouts.map((scout) => {
                const values = playersWithRankings.map(p => p.scoutRankings?.[scout.key as keyof typeof p.scoutRankings]);
                const bestIndex = findBestRank(values);
                
                return (
                  <TableRow 
                    key={scout.key}
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
                      {scout.label}
                    </TableCell>
                    {playersWithRankings.map((player, index) => {
                      const rank = player.scoutRankings?.[scout.key as keyof typeof player.scoutRankings];
                      
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
                          {rank || '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ 
                    fontWeight: 600,
                    borderRight: `1px solid ${theme.palette.divider}`
                  }}
                >
                  Average Rank
                </TableCell>
                {playersWithRankings.map((player, index) => {
                  const avgRank = calculateAverageRank(player);
                  
                  return (
                    <TableCell
                      key={player.playerId}
                      sx={{
                        color: colors[index],
                        fontWeight: 600,
                        backgroundColor: avgRank ? `${colors[index]}15` : 'transparent'
                      }}
                    >
                      {avgRank || '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </motion.div>
  );
};

export default ScoutRankingsTable; 