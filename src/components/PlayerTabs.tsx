import { Tabs, Tab, Box } from '@mui/material';
import React, { useState } from 'react';

interface PlayerTabsProps {
  overview: React.ReactNode;
  stats: React.ReactNode;
  reports: React.ReactNode;
  initialTab?: number;
}

const PlayerTabs: React.FC<PlayerTabsProps> = ({ overview, stats, reports, initialTab = 0 }) => {
  const [tab, setTab] = useState(initialTab);
  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, pt: 2 }}>
        <Tab label="Overview" />
        <Tab label="Stats" />
        <Tab label="Reports" />
      </Tabs>
      <Box sx={{ px: 3, py: 2 }}>
        {tab === 0 && overview}
        {tab === 1 && stats}
        {tab === 2 && reports}
      </Box>
    </>
  );
};

export default PlayerTabs; 