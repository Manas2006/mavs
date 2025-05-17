import { Box, Typography, Paper } from '@mui/material';
import React from 'react';

interface ScoutReport {
  notes: string;
  rating: number;
  scout?: string;
}

interface ScoutReportsListProps {
  reports: ScoutReport[];
  title?: string;
}

const ScoutReportsList: React.FC<ScoutReportsListProps> = ({ reports, title }) => (
  <Box>
    {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
    {reports.length === 0 ? (
      <Typography variant="body2">No scouting reports available.</Typography>
    ) : (
      reports.map((report, idx) => (
        <Paper key={idx} sx={{ mb: 2, p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
          {report.scout && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>{report.scout}</Typography>
          )}
          <Typography variant="body2" color="text.secondary">Rating: {report.rating}/10</Typography>
          <Typography variant="body1">{report.notes}</Typography>
        </Paper>
      ))
    )}
  </Box>
);

export default ScoutReportsList; 