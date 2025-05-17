import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import PlayerPhotoCard from '../components/PlayerPhotoCard';
import ScoutRankingsTable from '../components/ScoutRankingsTable';
import MeasurementsTable from '../components/MeasurementsTable';
import ScoutReportForm from '../components/ScoutReportForm';
import ScoutReportsList from '../components/ScoutReportsList';
import GameReportsTable from '../components/GameReportsTable';
import PlayerTabs from '../components/PlayerTabs';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [scoutRankings, setScoutRankings] = useState<any>({});
  const [measurements, setMeasurements] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoutingReports, setScoutingReports] = useState<{notes: string, rating: number, scout?: string}[]>([]);
  const [seasonStats, setSeasonStats] = useState<any[]>([]);
  const [gameReports, setGameReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('/players.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load players.json');
        return res.json();
      })
      .then(data => {
        const playerObj = data.bio.find((p: any) => p.playerId === Number(id));
        setPlayer(playerObj);
        setScoutRankings(data.scoutRankings.find((r: any) => r.playerId === Number(id)) || {});
        setMeasurements(data.measurements.find((m: any) => m.playerId === Number(id)) || {});
        setSeasonStats((data.seasonLogs || []).filter((log: any) => log.playerId === Number(id)));
        setGameReports((data.gameReports || []).filter((g: any) => g.playerId === Number(id)));
        setScoutingReports((data.scoutingReports || []).filter((r: any) => r.playerId === Number(id)));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleReportSubmit = (report: { notes: string; rating: number }) => {
    setScoutingReports(prev => [{ ...report }, ...prev]);
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!player) return <Box><Typography variant="h4">Player not found</Typography></Box>;

  // Game report columns (customize as needed)
  const gameColumns = [
    { label: 'Date', key: 'date' },
    { label: 'Opponent', key: 'opponent' },
    { label: 'PTS', key: 'pts' },
    { label: 'REB', key: 'reb' },
    { label: 'AST', key: 'ast' },
    { label: 'MIN', key: 'timePlayed' },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
      <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2.2rem', sm: '3rem' } }}>
        {player.name}
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start" sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <PlayerPhotoCard name={player.name} photoUrl={player.photoUrl} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <PlayerTabs
              overview={<ScoutRankingsTable rankings={scoutRankings} title="Scout Rankings" />}
              stats={<GameReportsTable games={seasonStats} columns={gameColumns} title="Game Reports" />}
              reports={
                <Box>
                  <ScoutReportForm onSubmit={handleReportSubmit} />
                  <ScoutReportsList reports={scoutingReports} />
                </Box>
              }
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
            <ScoutRankingsTable rankings={scoutRankings} title="Scout Rankings" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
            <MeasurementsTable measurements={measurements} title="Measurements" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerProfile; 