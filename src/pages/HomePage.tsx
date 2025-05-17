import { Container, Typography, Grid, Paper, Box, Button, Stack, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

interface PlayerBio {
  playerId: number;
  name: string;
}

interface ScoutRanking {
  playerId: number;
  [key: string]: number | null;
}

const HomePage = () => {
  const [topPlayers, setTopPlayers] = useState<string[]>([]);
  const [avgVariance, setAvgVariance] = useState<string>('–');
  const theme = useTheme();

  useEffect(() => {
    fetch('/players.json')
      .then(res => res.json())
      .then(data => {
        const bios: PlayerBio[] = data.bio;
        const rankings: ScoutRanking[] = data.scoutRankings;
        // Compute consensus rank (average of all available ranks)
        const consensus = rankings.map(r => {
          const values = Object.entries(r)
            .filter(([k, v]) => k !== 'playerId' && v !== null && typeof v === 'number')
            .map(([_, v]) => v as number);
          const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : Infinity;
          return { playerId: r.playerId, avg, values };
        });
        consensus.sort((a, b) => a.avg - b.avg);
        const top5 = consensus.slice(0, 5).map(c => {
          const bio = bios.find(b => b.playerId === c.playerId);
          return bio ? bio.name : '';
        }).filter(Boolean);
        setTopPlayers(top5);
        // Calculate average variance
        const variances = consensus
          .map(c => {
            if (!c.values || c.values.length < 2) return null;
            const mean = c.avg;
            const variance = c.values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / c.values.length;
            return variance;
          })
          .filter((v): v is number => v !== null && !isNaN(v));
        const avgVar = variances.length ? (variances.reduce((a, b) => a + b, 0) / variances.length) : 0;
        setAvgVariance(avgVar.toFixed(1));
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
          Welcome to Mavericks Draft Hub
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
          A tool for the Mavericks front office to prepare for the NBA Draft
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center" mb={6}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.025)' } }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>Avg Scout Variance</Typography>
            <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>{avgVariance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.025)' } }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom># of Prospects Ranked</Typography>
            <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>50</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { boxShadow: 8, transform: 'scale(1.025)' } }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>Top 5 Consensus Players</Typography>
            <List dense>
              {topPlayers.map((name, idx) => (
                <ListItem key={name} disablePadding>
                  <ListItemText primary={`${idx + 1}. ${name}`} primaryTypographyProps={{ fontWeight: 600, fontSize: '1.1rem' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Box textAlign="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Quick Links</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/big-board"
            sx={{
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1.15rem',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 8,
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.06)',
              },
            }}
          >
            View Big Board
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/reports"
            sx={{
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1.15rem',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 8,
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.06)',
              },
            }}
          >
            Scout Reports
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage; 