import { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

interface ScoutReportFormProps {
  onSubmit: (report: { notes: string; rating: number }) => void;
  loading?: boolean;
}

const ScoutReportForm: React.FC<ScoutReportFormProps> = ({ onSubmit, loading }) => {
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onSubmit({ notes, rating });
    setNotes('');
    setRating(5);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" gutterBottom>Submit a Scouting Report</Typography>
      <TextField
        label="Notes"
        multiline
        minRows={2}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        required
        fullWidth
      />
      <FormControl sx={{ width: 120 }}>
        <InputLabel id="rating-label">Rating</InputLabel>
        <Select
          labelId="rating-label"
          value={rating}
          label="Rating"
          onChange={e => setRating(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        Submit Report
      </Button>
    </Box>
  );
};

export default ScoutReportForm; 