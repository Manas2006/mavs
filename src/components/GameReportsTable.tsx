import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import React from 'react';

interface GameReportsTableProps {
  games: Record<string, any>[];
  columns: { label: string; key: string }[];
  title?: string;
}

const GameReportsTable: React.FC<GameReportsTableProps> = ({ games, columns, title }) => (
  <>
    {title && <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>}
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {games.length > 0 ? (
            games.map((game, idx) => (
              <TableRow key={idx}>
                {columns.map(col => (
                  <TableCell key={col.key}>{game[col.key] !== undefined && game[col.key] !== null ? String(game[col.key]) : '-'}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={columns.length}>No game reports available.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default GameReportsTable; 