import { useParams } from 'react-router-dom';
import { Typography, Box, Paper, TextField, Button, MenuItem, FormControl, InputLabel, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MuiPaper from '@mui/material/Paper';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [scoutRankings, setScoutRankings] = useState<any>({});
  const [measurements, setMeasurements] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [reportNotes, setReportNotes] = useState('');
  const [reportRating, setReportRating] = useState(5);
  const [scoutingReports, setScoutingReports] = useState<{notes: string, rating: number}[]>([]);
  const [viewMode, setViewMode] = useState<'perGame' | 'total'>('perGame');
  const [seasonStats, setSeasonStats] = useState<any[]>([]);

  const percentageFields = ["FG%", "FG2%", "eFG%", "3P%", "FTP"];
  const metaKeys = ["Season", "League", "Team", "w", "l", "GP", "GS"];

  const statKeys = useMemo(() => {
    if (!seasonStats.length) return [];
    return Object.keys(seasonStats[0]).filter(
      k => !metaKeys.includes(k) && k !== 'playerId' && k !== 'age'
    );
  }, [seasonStats]);

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
        const logs = (data.seasonLogs || []).filter((log: any) => log.playerId === Number(id));
        setSeasonStats(logs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Box>Loading...</Box>;
  }
  if (error) {
    return <Box>Error: {error}</Box>;
  }
  if (!player) {
    return (
      <Box>
        <Typography variant="h4">Player not found</Typography>
      </Box>
    );
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNotes.trim()) return;
    setScoutingReports(prev => [{ notes: reportNotes, rating: reportRating }, ...prev]);
    setReportNotes('');
    setReportRating(5);
  };

  const renderStatsTable = () => {
    if (!seasonStats.length) return <Typography variant="body2">No season stats available.</Typography>;
    return (
      <TableContainer component={MuiPaper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {metaKeys.map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              {statKeys.map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {seasonStats.map((row, idx) => (
              <TableRow key={idx}>
                {metaKeys.map(key => (
                  <TableCell key={key}>{row[key] !== undefined && row[key] !== null ? String(row[key]) : '-'}</TableCell>
                ))}
                {statKeys.map(key => {
                  const value = row[key];
                  if (value === undefined || value === null || isNaN(Number(value))) return <TableCell key={key}>-</TableCell>;
                  if (viewMode === 'perGame' || percentageFields.includes(key)) {
                    return <TableCell key={key}>{Number(value).toFixed(1)}</TableCell>;
                  } else if (row.GP && !percentageFields.includes(key)) {
                    return <TableCell key={key}>{(Number(value) * Number(row.GP)).toFixed(0)}</TableCell>;
                  } else {
                    return <TableCell key={key}>{Number(value).toFixed(1)}</TableCell>;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {player.name}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1">Team: {player.currentTeam}</Typography>
        <Typography variant="body1">League: {player.league}</Typography>
        <Typography variant="body1">Birth Date: {player.birthDate}</Typography>
        <Typography variant="body1">Height: {player.height} in</Typography>
        <Typography variant="body1">Weight: {player.weight} lbs</Typography>
        <Typography variant="body1">High School: {player.highSchool}</Typography>
        <Typography variant="body1">Hometown: {player.homeTown}, {player.homeState} {player.homeCountry}</Typography>
        {player.photoUrl && (
          <Box sx={{ mt: 2 }}>
            <img src={player.photoUrl} alt={player.name} style={{ maxWidth: 200 }} />
          </Box>
        )}
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Scout Rankings</Typography>
        {Object.entries(scoutRankings).filter(([k]) => k !== 'playerId').length > 0 ? (
          Object.entries(scoutRankings).filter(([k]) => k !== 'playerId').map(([scout, ranking]) => (
            <Typography key={scout} variant="body1">
              {scout}: {ranking !== undefined && ranking !== null ? String(ranking) : '-'}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">No scout rankings available.</Typography>
        )}
      </Paper>
      {Object.keys(measurements).filter(k => k !== 'playerId').length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Measurements</Typography>
          {Object.entries(measurements).filter(([k]) => k !== 'playerId').length > 0 ? (
            Object.entries(measurements).filter(([k]) => k !== 'playerId').map(([key, value]) => (
              <Typography key={key} variant="body1">
                {key}: {value !== undefined && value !== null ? String(value) : '-'}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No measurements available.</Typography>
          )}
        </Paper>
      )}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel id="view-mode-label">Stats View</InputLabel>
            <Select
              labelId="view-mode-label"
              value={viewMode}
              label="Stats View"
              onChange={e => setViewMode(e.target.value as 'perGame' | 'total')}
            >
              <MenuItem value="perGame">Per-Game Averages</MenuItem>
              <MenuItem value="total">Season Totals</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {renderStatsTable()}
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Submit a Scouting Report</Typography>
        <Box component="form" onSubmit={handleReportSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Notes"
            multiline
            minRows={2}
            value={reportNotes}
            onChange={e => setReportNotes(e.target.value)}
            required
            fullWidth
          />
          <FormControl sx={{ width: 120 }}>
            <InputLabel id="rating-label">Rating</InputLabel>
            <Select
              labelId="rating-label"
              value={reportRating}
              label="Rating"
              onChange={e => setReportRating(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Submit Report
          </Button>
        </Box>
      </Paper>
      {scoutingReports.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Submitted Scouting Reports</Typography>
          {scoutingReports.map((report, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Rating: {report.rating}/10</Typography>
              <Typography variant="body1">{report.notes}</Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default PlayerProfile; 