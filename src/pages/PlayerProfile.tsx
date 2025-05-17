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
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', pt: 2 }}>
      <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2.2rem', sm: '3rem' } }}>
        {player.name}
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 4,
        maxWidth: 900,
        mx: 'auto',
        mb: 4
      }}>
        <Box sx={{ flex: { md: '0 0 340px' }, width: '100%', maxWidth: 340, mb: { xs: 2, md: 0 }, display: 'flex', justifyContent: 'center' }}>
          <PlayerPhotoCard name={player.name} photoUrl={player.photoUrl} />
        </Box>
        <Paper elevation={2} sx={{ borderRadius: 3, width: '100%', minWidth: 0, p: 0, flex: 1 }}>
          <PlayerTabs
            overview={<GameReportsTable games={seasonStats} columns={gameColumns} title="Game Reports" />}
            stats={<ScoutReportsList reports={scoutingReports} />}
            reports={<ScoutReportForm onSubmit={handleReportSubmit} />}
          />
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'flex-start', gap: 4, maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Paper elevation={2} sx={{ borderRadius: 3, minWidth: 260, maxWidth: 340, width: '100%', p: 2 }}>
          <ScoutRankingsTable rankings={scoutRankings} title="Scout Rankings" />
        </Paper>
        <Paper elevation={2} sx={{ borderRadius: 3, minWidth: 260, maxWidth: 340, width: '100%', p: 2 }}>
          <MeasurementsTable measurements={measurements} title="Measurements" />
        </Paper>
      </Box>
    </Box>
  );
};

export default PlayerProfile; 