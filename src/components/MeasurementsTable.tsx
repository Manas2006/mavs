import { Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import React from 'react';

interface MeasurementsTableProps {
  measurements: Record<string, any>;
  title?: string;
}

const keyLabels: Record<string, string> = {
  heightNoShoes: 'Height (no shoes)',
  heightShoes: 'Height (with shoes)',
  wingspan: 'Wingspan',
  reach: 'Reach',
  maxVertical: 'Max Vertical',
  noStepVertical: 'No Step Vertical',
  weight: 'Weight',
  bodyFat: 'Body Fat',
  handLength: 'Hand Length',
  handWidth: 'Hand Width',
  agility: 'Agility',
  sprint: 'Sprint',
  shuttleLeft: 'Shuttle Left',
  shuttleRight: 'Shuttle Right',
  shuttleBest: 'Shuttle Best',
};

function toLabel(key: string) {
  if (keyLabels[key]) return keyLabels[key];
  // Fallback: split camelCase and capitalize
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ measurements, title }) => {
  const relevantKeys = ['wingspan', 'reach', 'maxVertical', 'bodyFat'];
  const entries = Object.entries(measurements).filter(([k]) => relevantKeys.includes(k));
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
                  <TableCell sx={{ border: 0 }}>{toLabel(key)}</TableCell>
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