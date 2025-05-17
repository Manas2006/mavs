import { Typography, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import React from 'react';

interface ScoutRankingsTableProps {
  rankings: Record<string, any>;
  title?: string;
}

const ScoutRankingsTable: React.FC<ScoutRankingsTableProps> = ({ rankings, title }) => {
  const entries = Object.entries(rankings).filter(([k]) => k !== 'playerId');
  return (
    <>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableBody>
            {entries.length > 0 ? (
              entries.map(([scout, ranking]) => (
                <TableRow key={scout}>
                  <TableCell sx={{ border: 0 }}>{scout}</TableCell>
                  <TableCell sx={{ border: 0, textAlign: 'right', fontWeight: 600 }}>{ranking !== undefined && ranking !== null ? String(ranking) : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={2}>No scout rankings available.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScoutRankingsTable; 