import type { Player } from '../types/player';

const roundToThree = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

export const calculatePlayerAttributes = (player: Player & { seasonStats: Record<string, number> }) => {
  if (!player.seasonStats) return [];

  const maxValues = {
    pts: 30,
    ast: 10,
    trb: 15,
    defense: 5,
    efficiency: 100
  };

  // Use the seasonStats object directly
  const stats = player.seasonStats;
  const averages = {
    PTS: stats.PTS || 0,
    AST: stats.AST || 0,
    TRB: stats.TRB || 0,
    BLK: stats.BLK || 0,
    STL: stats.STL || 0,
    'eFG%': stats['eFG%'] || 0
  };

  return [
    {
      subject: 'Scoring',
      value: roundToThree((averages.PTS / maxValues.pts) * 100),
      fullMark: 100
    },
    {
      subject: 'Playmaking',
      value: roundToThree((averages.AST / maxValues.ast) * 100),
      fullMark: 100
    },
    {
      subject: 'Rebounding',
      value: roundToThree((averages.TRB / maxValues.trb) * 100),
      fullMark: 100
    },
    {
      subject: 'Defense',
      value: roundToThree((((averages.BLK || 0) + (averages.STL || 0)) / maxValues.defense) * 100),
      fullMark: 100
    },
    {
      subject: 'Efficiency',
      value: roundToThree(averages['eFG%'] || 0),
      fullMark: 100
    }
  ];
}; 