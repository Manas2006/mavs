import { Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import React from 'react';

interface MeasurementsTableProps {
  measurements: Record<string, any>;
  title?: string;
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ measurements, title }) => {
  const entries = Object.entries(measurements).filter(([k]) => k !== 'playerId');
  return (
    <>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableBody>
            {entries.length > 0 ? (
              entries.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ border: 0 }}>{key}</TableCell>
                  <TableCell sx={{ border: 0, textAlign: 'right', fontWeight: 600 }}>{value !== undefined && value !== null ? String(value) : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={2}>No measurements available.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MeasurementsTable; 